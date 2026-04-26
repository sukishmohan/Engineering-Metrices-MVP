# Engineering Metrics MVP - Backend

Node.js/Express backend for the engineering metrics profile API.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

The backend will run on `http://localhost:5000`

Verify it's working:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-26T..."
}
```

### 3. Development mode (with auto-reload)
```bash
npm run dev
```

(Requires `nodemon` to be installed)

## API Endpoints

### GET /api/ic/:developerId/profile

Fetch the engineering metrics profile for a developer.

**Query Parameters:**
- `month` (optional): Month in format `YYYY-MM`. Defaults to `2026-04`.

**Example:**
```bash
curl "http://localhost:5000/api/ic/dev-001/profile?month=2026-04"
```

**Response:**
```json
{
  "developer": {
    "id": "dev-001",
    "name": "Alice Johnson",
    "team": "Platform"
  },
  "month": "2026-04",
  "metrics": {
    "leadTime": 3.5,
    "cycleTime": 2.8,
    "bugRate": 8.5,
    "deploymentFrequency": 8,
    "prThroughput": 4
  },
  "interpretation": {
    "pattern": "healthy",
    "story": "Your engineering metrics are healthy...",
    "diagnosis": "...",
    "actions": [...]
  },
  "generatedAt": "2026-04-26T..."
}
```

## Data Model

### Developers
Located in `data/developers.json`. Each developer has an `id` used to filter metrics.

### Issues & Status Changes
- `data/issues.json`: Issue definitions with assignee
- `data/issueStatusChanges.json`: State transitions (Open → In Progress → In Review → Done)

**Cycle Time Calculation:** Time from "In Progress" to "Done"

### Pull Requests
Located in `data/prs.json`. Each PR has:
- `author_id`: Developer who wrote the PR
- `opened_at`, `merged_at`: Timestamps
- `status`: "merged" or "open"

### Deployments
Located in `data/deployments.json`. Each deployment has:
- `deployed_at`: Deployment timestamp
- `status`: "success" or "failed"
- `included_pr_ids`: Array of PR IDs in this deployment

**Lead Time Calculation:** Time from PR opened to first successful deployment containing that PR

### Bugs
Located in `data/bugs.json`. Bugs found in production with:
- `found_in_month`: Month the bug was discovered
- `traced_to_developer_id`: Developer responsible
- `traced_to_pr_id`: PR that introduced the bug

**Bug Rate Calculation:** Bugs found in month ÷ Issues completed by developer in that month

## Architecture

- **server.js** - Express app setup and middleware
- **routes/ic.routes.js** - HTTP route definitions
- **controllers/icProfileController.js** - Request orchestration
- **services/metricsService.js** - Metric calculations (pure business logic)
- **services/interpretationService.js** - Interpretation engine (pattern detection + action generation)
- **services/dataService.js** - Data loading from JSON files

## Metrics Explained

### 1. Lead Time for Changes (days)
Average time from PR opened → successful production deploy

### 2. Cycle Time (days)
Average time from issue moved to "In Progress" → marked "Done"

### 3. Bug Rate (%)
Escaped production bugs this month ÷ issues completed this month

### 4. Deployment Frequency (count)
Number of successful production deployments this month (team-wide)

### 5. PR Throughput (count)
Number of merged PRs this month (per developer)

## Interpretation Patterns

The backend automatically detects patterns:
- **fast_but_fragile**: High speed + high bug rate
- **thorough_but_slow**: Low speed + high quality
- **blocked**: All metrics low
- **healthy**: All metrics in acceptable range
- **mixed**: No clear pattern

For each pattern, 1-2 actionable next steps are suggested.

## Testing Locally

### Test Alice (Senior, well-balanced)
```bash
curl "http://localhost:5000/api/ic/dev-001/profile"
```

### Test Bob (Mobile, showing trade-offs)
```bash
curl "http://localhost:5000/api/ic/dev-002/profile"
```

### Test Carol (Junior, ramping up)
```bash
curl "http://localhost:5000/api/ic/dev-003/profile"
```

## Scaling Considerations

**Current MVP:** JSON files loaded into memory
**Production migration:**
1. Replace `dataService.js` to query a real database (PostgreSQL, MongoDB)
2. Add caching layer (Redis) for frequently accessed profiles
3. Batch metric calculations if many developers
4. Add API authentication/authorization
5. Implement request rate limiting
6. Add monitoring and logging

## CORS

The server allows CORS requests from any origin. Update `server.js` in production to restrict to your frontend domain.
