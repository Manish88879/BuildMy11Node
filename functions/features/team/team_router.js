const express = require("express");
const router = express.Router();

const teamController = require("./team_controller");

router.post("/createTeam", teamController.createTeam);
router.post("/getTeamList", teamController.getTeamList);
router.post("/getTeamDetails", teamController.getTeamDetails);

module.exports = router;
