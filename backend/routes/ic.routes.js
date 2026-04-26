/**
 * routes/ic.routes.js
 * 
 * Why: Thin routing layer that delegates to controller.
 * Keeps routes focused on HTTP concerns.
 */

const express = require('express');
const icProfileController = require('../controllers/icProfileController');

const router = express.Router();

/**
 * GET /api/ic/:developerId/profile
 * 
 * Params:
 *   developerId: string (e.g., "dev-001")
 *   month: string, optional (e.g., "2026-04"). Defaults to current month.
 * 
 * Returns: IC profile with metrics, interpretation, and action items
 */
router.get('/:developerId/profile', icProfileController.getICProfile);

module.exports = router;
