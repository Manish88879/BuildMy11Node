const express = require("express");
const router = express.Router();

const scorecardController = require('./scorecard_controller');
router.get("/fetchScorecard", scorecardController.fetchScorecard);
router.get("/getScorecardAtMatchLevel", scorecardController.getScorecardAtMatchLevel);
router.get(
  "/getScorecardAtContestLevel",
  scorecardController.getScorecardAtContestLevel
);

module.exports = router;
