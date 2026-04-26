/**
 * services/metricsService.js
 * 
 * Why: Pure business logic for metric calculation. No HTTP, no side effects.
 * Each function is testable and reusable.
 */

const {
  issues,
  issueStatusChanges,
  prs,
  deployments,
  bugs
} = require('./dataService');

/**
 * METRIC 1: Lead Time for Changes
 * Definition: Avg time from PR opened → successful production deploy (in days)
 */
function calculateLeadTime(developerId, month) {
  // Filter PRs: merged by this dev, in this month
  const developerPRs = prs.filter(pr =>
    pr.author_id === developerId &&
    pr.status === 'merged' &&
    pr.merged_at.startsWith(month)
  );

  if (developerPRs.length === 0) {
    return 0;
  }

  // For each PR, find deployment and calculate lead time
  const leadTimes = developerPRs.map(pr => {
    // Find first successful deployment that includes this PR
    const deployment = deployments.find(d =>
      d.status === 'success' &&
      d.included_pr_ids.includes(pr.id) &&
      d.deployed_at > pr.merged_at
    );

    if (!deployment) {
      return null;
    }

    // Calculate time difference in days
    const openDate = new Date(pr.opened_at);
    const deployDate = new Date(deployment.deployed_at);
    const diffMs = deployDate - openDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays;
  }).filter(lt => lt !== null);

  if (leadTimes.length === 0) {
    return 0;
  }

  const average = leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length;
  return Math.round(average * 10) / 10;
}

/**
 * METRIC 2: Cycle Time
 * Definition: Avg time from issue moved to "In Progress" → marked "Done" (in days)
 */
function calculateCycleTime(developerId, month) {
  // Find all "Done" status changes in this month
  const doneChanges = issueStatusChanges.filter(change =>
    change.new_status === 'Done' &&
    change.changed_at.startsWith(month)
  );

  // Filter for issues assigned to this developer
  const developerDoneChanges = doneChanges.filter(change => {
    const issue = issues.find(i => i.id === change.issue_id);
    return issue && issue.assignee_id === developerId;
  });

  if (developerDoneChanges.length === 0) {
    return 0;
  }

  // For each completed issue, find "In Progress" timestamp and calculate cycle time
  const cycleTimes = developerDoneChanges.map(doneChange => {
    const inProgressChange = issueStatusChanges.find(change =>
      change.issue_id === doneChange.issue_id &&
      change.new_status === 'In Progress'
    );

    if (!inProgressChange) {
      return null;
    }

    const startDate = new Date(inProgressChange.changed_at);
    const endDate = new Date(doneChange.changed_at);
    const diffMs = endDate - startDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays;
  }).filter(ct => ct !== null);

  if (cycleTimes.length === 0) {
    return 0;
  }

  const average = cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length;
  return Math.round(average * 10) / 10;
}

/**
 * METRIC 3: Bug Rate
 * Definition: Escaped production bugs this month ÷ issues completed this month (as %)
 */
function calculateBugRate(developerId, month) {
  // Count bugs found in production this month
  const bugsThisMonth = bugs.filter(bug =>
    bug.found_in_month === month &&
    bug.traced_to_developer_id === developerId
  );

  // Count issues completed by this dev this month
  const completedIssues = issueStatusChanges.filter(change =>
    change.new_status === 'Done' &&
    change.changed_at.startsWith(month)
  );

  const developerCompletedCount = completedIssues.filter(change => {
    const issue = issues.find(i => i.id === change.issue_id);
    return issue && issue.assignee_id === developerId;
  }).length;

  if (developerCompletedCount === 0) {
    return 0;
  }

  const percentage = (bugsThisMonth.length / developerCompletedCount) * 100;
  return Math.round(percentage * 10) / 10;
}

/**
 * METRIC 4: Deployment Frequency
 * Definition: Count of successful production deploys this month (team-wide)
 */
function calculateDeploymentFrequency(month) {
  const successfulDeploys = deployments.filter(d =>
    d.status === 'success' &&
    d.deployed_at.startsWith(month)
  );

  return successfulDeploys.length;
}

/**
 * METRIC 5: PR Throughput
 * Definition: Count of merged PRs this month
 */
function calculatePRThroughput(developerId, month) {
  const mergedPRs = prs.filter(pr =>
    pr.author_id === developerId &&
    pr.status === 'merged' &&
    pr.merged_at.startsWith(month)
  );

  return mergedPRs.length;
}

module.exports = {
  calculateLeadTime,
  calculateCycleTime,
  calculateBugRate,
  calculateDeploymentFrequency,
  calculatePRThroughput
};
