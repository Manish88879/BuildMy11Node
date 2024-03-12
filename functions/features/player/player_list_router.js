const express = require('express');
const router = express.Router();

const competitionSquadPlayer = require('./player_list_controller');

router.post(
  "/getMatchPlayers",
  competitionSquadPlayer.getFantasyMatchSquadPlayer
);

router.get("/matchPlaying11", competitionSquadPlayer.matchPlaying11);
// router.get("/matchFantasyPoints", competitionSquadPlayer.matchFantasyPoints);


module.exports = router;