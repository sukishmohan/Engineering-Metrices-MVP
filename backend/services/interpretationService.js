/**
 * services/interpretationService.js
 * 
 * Why: The "magic" layer. Converts raw metrics into actionable insights.
 * Benchmarks are tunable and based on DORA metrics standards.
 */

// Benchmarks (can be configured per org)
const BENCHMARKS = {
  leadTime: { good: 2, warning: 5 },      // days
  cycleTime: { good: 3, warning: 7 },     // days
  bugRate: { good: 5, warning: 10 },      // percentage
  deploymentFrequency: { good: 6, warning: 3 }, // per month
  prThroughput: { good: 10, warning: 5 }  // per month
};

function classifyLeadTime(days) {
  if (days === 0) return { status: 'unknown', score: 0.5, label: 'no data' };
  if (days < BENCHMARKS.leadTime.good) {
    return { status: 'good', score: 0.8, label: `${days} days (shipping very fast)` };
  }
  if (days < BENCHMARKS.leadTime.warning) {
    return { status: 'warning', score: 0.5, label: `${days} days (normal pace)` };
  }
  return { status: 'concern', score: 0.2, label: `${days} days (shipping is slow)` };
}

function classifyCycleTime(days) {
  if (days === 0) return { status: 'unknown', score: 0.5, label: 'no data' };
  if (days < BENCHMARKS.cycleTime.good) {
    return { status: 'good', score: 0.8, label: `${days} days (resolving very fast)` };
  }
  if (days < BENCHMARKS.cycleTime.warning) {
    return { status: 'warning', score: 0.5, label: `${days} days (normal pace)` };
  }
  return { status: 'concern', score: 0.2, label: `${days} days (resolving is slow)` };
}

function classifyBugRate(percentage) {
  if (percentage === 0) return { status: 'good', score: 0.9, label: `${percentage}% (perfect!)` };
  if (percentage < BENCHMARKS.bugRate.good) {
    return { status: 'good', score: 0.8, label: `${percentage}% (very high quality)` };
  }
  if (percentage < BENCHMARKS.bugRate.warning) {
    return { status: 'warning', score: 0.5, label: `${percentage}% (acceptable quality)` };
  }
  return { status: 'concern', score: 0.2, label: `${percentage}% (quality is slipping)` };
}

function classifyDeploymentFrequency(count) {
  if (count > BENCHMARKS.deploymentFrequency.good) {
    return { status: 'good', score: 0.8, label: `${count} deploys (shipping frequently)` };
  }
  if (count >= BENCHMARKS.deploymentFrequency.warning) {
    return { status: 'warning', score: 0.5, label: `${count} deploys (steady pace)` };
  }
  return { status: 'concern', score: 0.2, label: `${count} deploys (infrequent)` };
}

function classifyPRThroughput(count) {
  if (count > BENCHMARKS.prThroughput.good) {
    return { status: 'good', score: 0.8, label: `${count} PRs (shipping lots)` };
  }
  if (count >= BENCHMARKS.prThroughput.warning) {
    return { status: 'warning', score: 0.5, label: `${count} PRs (steady pace)` };
  }
  return { status: 'concern', score: 0.2, label: `${count} PRs (shipping infrequently)` };
}

/**
 * Detect pattern from classified metrics
 * Combinations of metrics tell a story. This is where interpretation becomes actionable.
 */
function detectPattern(classified) {
  const { leadTime, cycleTime, bugRate, deploymentFrequency, prThroughput } = classified;

  // Pattern 1: Fast but Fragile
  if (
    leadTime.score >= 0.7 &&
    prThroughput.score >= 0.7 &&
    bugRate.score <= 0.4
  ) {
    return 'fast_but_fragile';
  }

  // Pattern 2: Thorough but Slow
  if (
    cycleTime.score <= 0.4 &&
    prThroughput.score <= 0.4 &&
    bugRate.score >= 0.7
  ) {
    return 'thorough_but_slow';
  }

  // Pattern 3: Blocked or Struggling
  if (
    cycleTime.score <= 0.3 &&
    prThroughput.score <= 0.3 &&
    leadTime.score <= 0.3
  ) {
    return 'blocked';
  }

  // Pattern 4: Healthy All-Around
  const goodOrWarningCount = Object.values(classified).filter(
    c => c.score >= 0.5
  ).length;
  if (goodOrWarningCount >= 4) {
    return 'healthy';
  }

  return 'mixed';
}

function generateInterpretation(metrics) {
  // Step 1: Classify each metric
  const classified = {
    leadTime: classifyLeadTime(metrics.leadTime),
    cycleTime: classifyCycleTime(metrics.cycleTime),
    bugRate: classifyBugRate(metrics.bugRate),
    deploymentFrequency: classifyDeploymentFrequency(metrics.deploymentFrequency),
    prThroughput: classifyPRThroughput(metrics.prThroughput)
  };

  // Step 2: Detect pattern
  const pattern = detectPattern(classified);

  // Step 3: Generate story, diagnosis, and actions based on pattern
  const { story, diagnosis, actions } = generateStoryAndActions(pattern, classified);

  return {
    pattern,
    story,
    diagnosis,
    actions,
    classifications: classified
  };
}

function generateStoryAndActions(pattern, classified) {
  const templates = {
    fast_but_fragile: {
      story: "You're shipping fast and frequently, but quality is slipping.",
      diagnosis: `You're opening and merging PRs quickly (${classified.prThroughput.label}), 
which is great for velocity. However, your bug rate (${classified.bugRate.label}) 
suggests that speed is coming at the cost of thoroughness.

Likely causes: 
- Unclear requirements → starting before fully understanding the task
- Light code reviews → edge cases slip through
- Insufficient testing → bugs reach production`,
      actions: [
        {
          title: "Create a pre-submission checklist",
          description: "Before opening a PR, verify: (1) Does the ticket have clear acceptance criteria? (2) Did I test the happy path AND edge cases? (3) Did I search for similar bugs I've shipped before?",
          effort: "quick",
          expectedImpact: "Reduce bug rate by ~20%",
          timeframe: "Start with your next 3 PRs"
        },
        {
          title: "Request deeper code reviews",
          description: "In your next PR, explicitly flag risky areas. Ask reviewers to focus on edge cases, security, and performance. Share context about the domain.",
          effort: "quick",
          expectedImpact: "Catch bugs before they reach production",
          timeframe: "This week"
        }
      ]
    },

    thorough_but_slow: {
      story: "You're delivering high-quality code, but it's taking longer than typical.",
      diagnosis: `Your bug rate (${classified.bugRate.label}) is excellent, showing that you care 
about quality. However, your cycle time (${classified.cycleTime.label}) and PR throughput 
(${classified.prThroughput.label}) are lower than the team average.

Likely causes:
- Over-scoping or perfectionism
- Unclear requirements leading to rework
- Waiting on feedback/reviews
- Complex technical challenges`,
      actions: [
        {
          title: "Clarify requirements before you start",
          description: "Before coding, spend 10 minutes with the ticket author: What's the acceptance criteria? What's out of scope? What's ambiguous? This prevents rework.",
          effort: "quick",
          expectedImpact: "Reduce cycle time by ~1–2 days",
          timeframe: "Start now"
        },
        {
          title: "Time-box your work on each task",
          description: "Set a timer. When time is up, ask yourself: Is this complete enough? Should I escalate or ask for help instead of polishing?",
          effort: "moderate",
          expectedImpact: "Ship more frequently, maintain quality",
          timeframe: "Next sprint"
        }
      ]
    },

    blocked: {
      story: "Your metrics are consistently low across the board. You might be blocked or under-utilized.",
      diagnosis: `Your cycle time (${classified.cycleTime.label}), PR throughput (${classified.prThroughput.label}), 
and lead time (${classified.leadTime.label}) are all below team average.

This could mean:
- You're waiting on external teams (design, product, infra)
- Unclear sprint/roadmap priorities
- Low-quality or incomplete tickets
- Personal blockers or context switching
- Or you're new to the team and ramping up`,
      actions: [
        {
          title: "Schedule a 1:1 with your manager",
          description: "Your metrics suggest blockers. Discuss: Are you on the right projects? What's blocking you? What support do you need?",
          effort: "quick",
          expectedImpact: "Identify and remove blockers",
          timeframe: "This week"
        },
        {
          title: "Break down large tickets into smaller chunks",
          description: "Ask your PM/manager to split ambiguous tickets. Smaller = more achievable = better momentum.",
          effort: "moderate",
          expectedImpact: "Increase throughput and visibility",
          timeframe: "Next sprint"
        }
      ]
    },

    healthy: {
      story: "Your engineering metrics are healthy. You're shipping at a good pace with acceptable quality.",
      diagnosis: `Across the board, your metrics are in the good or warning range. 
You're balancing speed (${classified.leadTime.label}, ${classified.prThroughput.label}) 
with quality (${classified.bugRate.label}).`,
      actions: [
        {
          title: "Document and share your process",
          description: "You're doing something right. Write down your workflow: How do you scope work? How do you review code? What's your testing strategy? Share with the team.",
          effort: "moderate",
          expectedImpact: "Help teammates improve, build leadership skills",
          timeframe: "Next month"
        }
      ]
    },

    mixed: {
      story: "Your metrics show mixed signals. You're strong in some areas, but have opportunities in others.",
      diagnosis: `You don't fit a clear pattern, which is normal. Focus on your individual metrics:
- Lead Time: ${classified.leadTime.label}
- Cycle Time: ${classified.cycleTime.label}
- Bug Rate: ${classified.bugRate.label}
- PR Throughput: ${classified.prThroughput.label}`,
      actions: [
        {
          title: "Focus on your lowest metric first",
          description: "Pick the one metric with the lowest score. Work on one small action to improve it this sprint.",
          effort: "moderate",
          expectedImpact: "Incremental improvement across the board",
          timeframe: "Next sprint"
        }
      ]
    }
  };

  return templates[pattern] || templates.mixed;
}

module.exports = {
  generateInterpretation,
  classifyLeadTime,
  classifyCycleTime,
  classifyBugRate,
  classifyDeploymentFrequency,
  classifyPRThroughput
};
