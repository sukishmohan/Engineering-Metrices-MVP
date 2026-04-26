/**
 * controllers/icProfileController.js
 * 
 * Why: Orchestrate the flow. Fetch data, calculate metrics, generate
 * interpretation, and format the response.
 */

const metricsService = require('../services/metricsService');
const interpretationService = require('../services/interpretationService');
const { getDeveloperById } = require('../services/dataService');

async function getICProfile(req, res) {
  try {
    const { developerId } = req.params;
    const { month } = req.query;

    // Edge case: developer doesn't exist
    // Returns 404, which frontend handles with error UI
    const developer = getDeveloperById(developerId);
    if (!developer) {
      return res.status(404).json({
        error: 'Developer not found',
        developerId
      });
    }

    // Get or infer month (default to April 2026 for demo)
    const targetMonth = month || '2026-04';

    // Calculate all 5 metrics
    const metrics = {
      leadTime: metricsService.calculateLeadTime(developerId, targetMonth),
      cycleTime: metricsService.calculateCycleTime(developerId, targetMonth),
      bugRate: metricsService.calculateBugRate(developerId, targetMonth),
      // NOTE: deploymentFrequency is TEAM-WIDE (all devs combined)
      // prThroughput is INDIVIDUAL (this dev's merged PRs)
      // They won't match 1:1. E.g., if 1 dev ships 2 PRs but team deploys 7 times,
      // that's because: (1) multiple devs' PRs deployed together, or
      // (2) team has frequent small rollouts. This is actually healthy signal
      // for high-performing teams that can decouple PR authorship from deployments.
      deploymentFrequency: metricsService.calculateDeploymentFrequency(targetMonth),
      prThroughput: metricsService.calculatePRThroughput(developerId, targetMonth)
    };

    // Generate interpretation (story + diagnosis + actions)
    const interpretation = interpretationService.generateInterpretation(metrics);

    // Format response
    const response = {
      developer: {
        id: developer.id,
        name: developer.name,
        team: developer.team
      },
      month: targetMonth,
      metrics,
      interpretation,
      generatedAt: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error(`Error in getICProfile: ${error.message}`);
    res.status(500).json({
      error: 'Failed to generate profile',
      message: error.message
    });
  }
}

module.exports = {
  getICProfile
};
