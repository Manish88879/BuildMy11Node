const express = require("express");
const router = express.Router();

const fantasyPointController = require('./fantasy_point_controller');

router.get("/fetchFantasyPointApi", fantasyPointController.fantasyPoint);

module.exports = router;
