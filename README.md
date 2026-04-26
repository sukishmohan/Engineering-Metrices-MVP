# Engineering Metrics MVP

A full-stack application that transforms raw engineering metrics into actionable insights for individual contributors.

## Overview

**Problem:** Developers see 5 metrics (Lead Time, Cycle Time, Bug Rate, Deployment Frequency, PR Throughput) but don't understand:
- What the numbers *mean*
- Whether they're good or bad
- What to do about them

**Solution:** An MVP that calculates metrics, interprets patterns, and suggests concrete next steps.

## Project Structure

```
MVP/
├── backend/                    # Node.js/Express API
│   ├── data/                   # Sample data (JSON)
│   ├── services/               # Business logic
│   ├── controllers/            # Request handlers
│   ├── routes/                 # HTTP routes
│   ├── server.js               # Express app
│   ├── package.json
│   └── README.md
│
└── frontend/                   # React application
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Page-level components
    │   ├── api/                # API client
    │   ├── styles/             # CSS files
    │   ├── types/              # TypeScript definitions
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    │   └── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── README.md
```

## The 5 Metrics

1. **Lead Time for Changes** (days)
   - Avg time from PR opened → successful production deploy
   - Goal: < 2 days

2. **Cycle Time** (days)
   - Avg time from issue "In Progress" → "Done"
   - Goal: < 3 days

3. **Bug Rate** (%)
   - Escaped bugs this month ÷ issues completed
   - Goal: < 5%

4. **Deployment Frequency** (count)
   - Successful production deploys per month (team-wide)
   - Goal: > 6 per month

5. **PR Throughput** (count)
   - Merged PRs per month per developer
   - Goal: > 10 per month

## The Interpretation Engine

The backend automatically detects patterns from metric combinations:

| Pattern | Meaning | Example Actions |
|---------|---------|------------------|
| **Fast but Fragile** | High speed + high bug rate | Add pre-submission checklist, request deeper reviews |
| **Thorough but Slow** | Low speed + high quality | Clarify requirements upfront, time-box work |
| **Blocked** | All metrics low | 1:1 with manager, break down large tickets |
| **Healthy** | All metrics in range | Document and share your process |
| **Mixed** | No clear pattern | Focus on lowest metric first |

## Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

Test: `curl http://localhost:5000/health`

### Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App opens at `http://localhost:3000`

### Demo Data

Three sample developers with different metric profiles:

- **dev-001**: Alice Johnson (Senior, balanced)
- **dev-002**: Bob Chen (Mobile, trade-offs)
- **dev-003**: Carol Davis (Junior, ramping up)

Switch between them in the UI dropdown to see different interpretation patterns.

## Key Features

✅ **5 DORA Metrics** - Industry-standard engineering metrics
✅ **Intelligent Interpretation** - Rule-based pattern detection
✅ **Actionable Insights** - Specific, achievable next steps
✅ **Visual Dashboard** - Clean, scannable UI with badges
✅ **TypeScript** - Type-safe across full stack
✅ **Clean Architecture** - Services, controllers, routes separation

## Tech Stack

**Backend:**
- Node.js + Express
- Pure JavaScript (no database yet)

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- CSS (no framework)

## Interview Points

### Scope & Product Thinking
- **Why one IC view?** Proves the core concept end-to-end without over-engineering. Scoped intentionally.
- **Manager view as stretch goal:** Would aggregate patterns across team (e.g., "30% of team is 'thorough but slow'" → training opportunity). Shows product thinking beyond MVP.

### Design Decisions
- **Rule-based interpretation, not ML:** Transparent, debuggable, requires <100 rows of data. Easy to tune benchmarks per org.
- **Three-layer flow:** Raw metrics → Classification → Pattern → Story → Actions. Each layer is testable and replaceable.

### Key Observations
- **PR Throughput (2) ≠ Deployment Frequency (7):** Healthy sign! Shows team can batch deploys and coordinate releases. Not every PR = a deploy (this is good).
- **Error handling:** Loading states, API failures, missing developers all handled gracefully.
- **Data traceability:** Bug rate requires tracing bugs → PRs → developers (real systems need good tagging).

### Scaling Considerations
1. **Database:** Replace JSON → PostgreSQL for real-time queries
2. **Caching:** Redis for frequently accessed profiles
3. **Batch calculations:** If 1000+ devs, calculate metrics async, cache results
4. **Governance:** Who can see whose metrics? Privacy + fairness critical
5. **Benchmarks:** Tune per org/team, not universal

### What I Used AI For (Responsibility)
- Code scaffolding & architecture (I verified & understood)
- CSS boilerplate (I wrote custom styles)
- Interpretation logic structure (I validated with sample data)
- What I did myself: Data modeling, metric calculations, metric linking, all business logic review

## Next Steps

1. Add more developers to sample data
2. **[Stretch Goal]** Build team dashboard view (aggregate patterns across team, identify which practices work)
3. Add historical trends (multiple months)
4. Replace JSON with real database
5. Add authentication and multi-tenancy
6. Create admin panel for benchmark tuning
7. Export/share profiles as PDF

## Notes

- Sample data covers April 2026
- Benchmarks (2 days lead time, 3 days cycle time, etc.) are tuned for a fast-moving team
- Bug tracing assumes bugs can be traced to PRs (implement your tracing logic)
- Deployment frequency is team-wide; other metrics are per-developer

---

**Built as an intern assignment to help developers understand their engineering metrics and improve their work.**
