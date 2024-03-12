const express = require("express");
const router = express.Router();



const statsController = require('./stats')
router.get("/getStatsAtContestLevel", statsController.statsAtContestLevel);
router.get("/getStatsAtMatchLevel", statsController.statsAtMatchLevel);


const winningsController = require('./winnings');
router.get("/getWinnings", winningsController.winnings);

const leaderboardController = require('./leaderboard');
router.get("/getLeaderboard", leaderboardController.leaderboard);

const teamPointController = require('./team_point');
router.get("/teamPoint", teamPointController.teamPoint);

const teamRankController = require('./team_rank_calculate');
router.get("/teamRankCalculate", teamRankController.teamRank);


module.exports = router;
