const api_collection = require("./../third_party_api/api_collection/api_collection");
const FantasyPoint = require("./fantasy_point_model");
const MatchList = require("./../match/match_list_model");
const TeamPlayer = require("./../team/team_player_model");
const axios = require("axios");

const fantasyPoint = async (req, res) => {
  try {
    let findMatch = await MatchList.find({ status: "3" });

    if (!findMatch.length) {
      return res.status(400).json({
        status: 0,
        message: "no matched found",
      });
    }
    // for (const match of findMatch) {
      findMatch.forEach(async (match) => {
      const match_id = match.match_id;
      let fantasyPointsApiPath = `${api_collection.fantasy_points_api}${match_id}/newpoint2?token=${process.env.third_party_api_token}`;
      //   console.log("fantasyPointsApiPath", fantasyPointsApiPath);

      const response = await axios.get(fantasyPointsApiPath);
      if (response.data.response.points.teama.playing11) {
        let teamA = response.data.response.points.teama.playing11;
        let teamB = response.data.response.points.teamb.playing11;
        let cid = response.data.response.competition.cid;
        const team = teamA.concat(teamB);
        // for (const player of team) {
        team.forEach(async (player) => {
          let pid = player.pid;

          const fantasyPoint = await FantasyPoint.updateOne(
            { match_id, cid, pid },
            {
              $set: {
                match_id: match_id,
                cid: cid,
                pid: player.pid,
                name: player.name,
                role: player.role,
                rating: player.rating,
                point: player.point,
                starting11: player.starting11,
                run: player.run,
                four: player.four,
                six: player.six,
                sr: player.sr,
                fifty: player.fifty,
                duck: player.duck,
                wkts: player.wkts,
                maidenover: player.maidenover,
                er: player.er,
                catch: player.catch,
                runoutstumping: player.runoutstumping,
                runoutthrower: player.runoutthrower,
                runoutcatcher: player.runoutcatcher,
                directrunout: player.directrunout,
                stumping: player.stumping,
                thirty: player.thirty,
                bonus: player.bonus,
                bonuscatch: player.bonuscatch,
                bonusbowedlbw: player.bonususbowedlbw,
              },
            },
            { upsert: true }
          );
          let pointInNumber = parseFloat(player.point);
          const teamPlayer = await TeamPlayer.updateMany(
            { match_id, cid, pid },
            [
              {
                $set: {
                  player_point: {
                    $cond: {
                      if: { $eq: ["$isCaptain", "true"] }, // Check if isCaptain is 'true' as a string
                      then: {
                        $multiply: [2, pointInNumber],
                      }, // Convert to double and double the player's points
                      else: {
                        $cond: {
                          if: { $eq: ["$isViceCaptain", "true"] }, // Check if isViceCaptain is 'true' as a string
                          then: {
                            $multiply: [1.5, pointInNumber],
                          }, // Convert to double and multiply by 1.5
                          else: 
                            pointInNumber,
                           // If neither captain nor vice_captain, use player's points as is after conversion
                        },
                      },
                    },
                  },
                },
              },
            ]
          );
        });
      }
    })
    res.status(200).json({
      status: 1,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = { fantasyPoint };
