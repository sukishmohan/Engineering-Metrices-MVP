/**
 * services/dataService.js
 * 
 * Why: Centralized data loading and access. In a real product, this would
 * talk to a database. For MVP, it loads from JSON.
 */

const fs = require('fs');
const path = require('path');

// Load all data files into memory
const developers = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/developers.json'), 'utf-8')
);

const issues = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/issues.json'), 'utf-8')
);

const issueStatusChanges = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/issueStatusChanges.json'), 'utf-8')
);

const prs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/prs.json'), 'utf-8')
);

const deployments = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/deployments.json'), 'utf-8')
);

const bugs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/bugs.json'), 'utf-8')
);

// Export for use in other services
module.exports = {
  developers,
  issues,
  issueStatusChanges,
  prs,
  deployments,
  bugs,

  // Helper functions
  getDeveloperById: (id) => developers.find(d => d.id === id),
  getAllDevelopers: () => developers
};
