const JoinContest = require("../join_contest/join_contest_model");
const Team = require("../team/team_model");
const FantasyPoint = require("../fantasy_point/fantasy_point_model");
const Player = require("./../player/player_list_model");
const TeamPlayer = require("./../team/team_player_model");

const statsAtMatchLevel = async (req, res) => {
  try {
    const match_id = req.query.match_id;
    const user_id = req.query.user_id;
    // const contest_id = req.query.contest_id;

    if (!user_id) {
      return res.status(400).json({
        status: 0,
        message: "user_id is required",
      });
    }

    const teams = await Team.find({ match_id });

    const findCountOfPlayers = await TeamPlayer.aggregate([
      {
        $match: { match_id: match_id },
      },
      {
        $group: {
          _id: "$pid",
          playerCount: { $sum: 1 },
          captainCount: {
            $sum: {
              $cond: { if: { $eq: ["$isCaptain", true] }, then: 1, else: 0 },
            },
          },
          viceCaptainCount: {
            $sum: {
              $cond: {
                if: { $eq: ["$isViceCaptain", true] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    ]);

    const findPlaying11 = await Player.find({
      match_id: match_id,
      playing11: true,
    });

    let playerDetails = [];
    for (const player of findPlaying11) {
      playerDetails.push({
        title: player.title,
        short_name: player.short_name,
        pid: player.pid,
        country: player.country,
        playing_role: player.playing_role,
        logo_url: player.logo_url,
        points: player.points,
        sel_by: 0.00,
        c_by: 0.00,
        vc_by: 0.00,
      });
    }
    for (const player of findCountOfPlayers) {
      const foundPlayer = playerDetails.find((item) => item.pid === player._id);

      if (foundPlayer) {
        foundPlayer.sel_by = ((player.playerCount / teams.length) * 100).toFixed(2);
        foundPlayer.c_by = ((player.captainCount / teams.length) * 100).toFixed(2);
        foundPlayer.vc_by = ((player.viceCaptainCount / teams.length) * 100).toFixed(2);
      }
    }
    const findMatch = await JoinContest.aggregate([
      {
        $match: {
          match_id: match_id,
          user_id: user_id,
          //contest_id: contest_id,
        },
      },
      {
        $lookup: {
          from: "teamplayers",
          localField: "team_id",
          foreignField: "team_id",
          as: "teamPlayer",
        },
      },
    ]);
    res.json({
      status: 1,
      message: "success",
      playerDetails: playerDetails,
      myTeam: findMatch,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const statsAtContestLevel = async (req, res) => {
  // try {
  //   const match_id = req.query.match_id;
  //   const user_id = req.query.user_id;
  //   const contest_id = req.query.contest_id;

  //   if (!user_id) {
  //     return res.status(400).json({
  //       status: 0,
  //       message: "user_id is required",
  //     });
  //   }

  //   const findPlaying11 = await Player.find({
  //     match_id: match_id,
  //     playing11: true,
  //   });
  //   let playerDetails = [];

  //   for (const player of findPlaying11) {
  //     playerDetails.push({
  //       title: player.title,
  //       short_name: player.short_name,
  //       pid: player.pid,
  //       country: player.country,
  //       playing_role: player.playing_role,
  //       logo_url: player.logo_url,
  //       points: player.points,
  //       sell_by: 0,
  //       c_by: 0,
  //       vc_by: 0,
  //     });
  //   }
  //   const findMatch = await JoinContest.aggregate([
  //     {
  //       $match: {
  //         match_id: match_id,
  //         user_id: user_id,
  //         contest_id: contest_id,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "teamplayers",
  //         localField: "team_id",
  //         foreignField: "team_id",
  //         as: "teamPlayer",
  //       },
  //     },
  //   ]);
  //   res.json({
  //     status: 1,
  //     message: "success",
  //     playerDetails: playerDetails,
  //     myTeam: findMatch,
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     status: 0,
  //     message: error.message,
  //   });
  // }
};

module.exports = { statsAtMatchLevel, statsAtContestLevel };
