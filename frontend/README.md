# Engineering Metrics MVP - Frontend

React frontend for the engineering metrics profile viewer.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### 3. Build for production
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory if you need to change the API URL:

```
VITE_API_URL=http://localhost:5000/api
```

By default, it connects to `http://localhost:5000/api`.

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/api/` - API client code
- `src/types/` - TypeScript type definitions
- `src/styles/` - Component-specific CSS files

## Features

- View engineering metrics for individual developers
- Visual interpretation of metrics (story + diagnosis)
- Actionable next steps based on metric patterns
- Switch between different developers to see their profiles
