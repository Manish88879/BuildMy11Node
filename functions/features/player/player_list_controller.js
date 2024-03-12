const FantasyMatchSquadPlayer = require("./player_list_model");
const thirdPartyFantasyMatchSquadPlayer = require("../third_party_api/fetch_fantasy_match_squad_player");
const api_collection = require("./../third_party_api/api_collection/api_collection");
const MatchList = require("./../match/match_list_model");
const axios = require("axios");
const Player = require("./player_list_model");

const getFantasyMatchSquadPlayer = async (req, res) => {
  try {
    const cid = req.query.cid;
    const match_id = req.query.match_id;
    // console.log("cid", cid, "match_id", match_id);
    if (!cid || !match_id) {
      return res.json({
        status: 0,
        message: "cid and match_id are required",
      });
    }
    let findPlayer = await FantasyMatchSquadPlayer.find({
      cid: cid,
      match_id: match_id,
    });
    // console.log("findPlayer", findPlayer);
    if (findPlayer.length) {
      return res.json({
        status: 1,
        message: "success",
        data: findPlayer,
      });
    } else {
      let thirdPartyApiResponse =
        await thirdPartyFantasyMatchSquadPlayer.fantasyMatchSquadPlayer(
          cid,
          match_id
        );
      //   console.log(thirdPartyApiResponse.status);
      let findPlayer;
      if (thirdPartyApiResponse.status) {
        findPlayer = await FantasyMatchSquadPlayer.find({
          cid: cid,
          match_id: match_id,
        });
      } else {
        return res.status(403).json({
          status: 0,
          message: thirdPartyApiResponse.status,
        });
      }
      return res.status(200).json({
        status: 1,
        message: "success",
        data: findPlayer,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const matchPlaying11 = async (req, res) => {
  try {
    let findMatch = await MatchList.find({ status: "3" });
    if (!findMatch.length) {
      return res.status(404).json({
        status: 0,
        message: "No upcoming matches found",
      });
    }

    for(let match of findMatch){

      if (match.toss_decision == "1" || match.toss_decision == "2") {
        const match_id = match.match_id;

        let matchPlaying11ApiPath = `${api_collection.match_playing11_api}${match_id}/squads?token=${process.env.third_party_api_token}`;
        const response = await axios.get(matchPlaying11ApiPath);
        const teamA = response.data.response.teama.squads;
        const teamB = response.data.response.teamb.squads;

        const team = teamA.concat(teamB);

          for(let player of team){
          const result = await Player.findOneAndUpdate(
            { pid: player.player_id, match_id: match_id },
            { $set: { playing11: player.playing11 } }
          );
        };
      }
    };
    res.status(200).json({
      status: 1,
      message: "playing11 updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  getFantasyMatchSquadPlayer,
  matchPlaying11,
  // matchFantasyPoints,
};
