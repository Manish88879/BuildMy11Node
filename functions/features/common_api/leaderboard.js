const Team = require("./../team/team_model");
const JoinContest = require("./../join_contest/join_contest_model");
const leaderboard = async (req, res) => {
  try {
    const match_id = req.query.match_id;
    const contest_id = req.query.contest_id;
    if (!match_id || !contest_id) {
      return res
        .status(400)
        .json({ status: 0, message: "match_id and cid are required" });
    }
    const getLeaderBoard = await JoinContest.aggregate([
      {
        $match: { match_id: match_id, contest_id: contest_id },
      },
      {
        $lookup: {
          from: "team1",
          localField: "team_id",
          foreignField: "team_id",
          as: "joinTeam",
        },
      },
      {
        $lookup: {
          from: "results",
          let: { team_id: "$team_id", contest_id: "$contest_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$team_id", "$$team_id"] },
                    { $eq: ["$contest_id", "$$contest_id"] },
                  ],
                },
              },
            },
          ],
          as: "results",
        },
      },
      {
        $addFields: {
          "joinTeam.results": {
            $cond: {
              if: { $ne: ["$results", []] },
              then: "$results",
              else: "$joinTeam.results", // Keep the existing array if empty
            },
          },
        },
      },
      {
        $unwind: {
          path: "$joinTeam",
          preserveNullAndEmptyArrays: true, // Preserve documents that don't have a corresponding team1 document
        },
      },
      {
        $unwind: {
          path: "$joinTeam?.results",
          preserveNullAndEmptyArrays: true, // Preserve documents that don't have results
        },
      },
      {
        $project: {
          _id: { $ifNull: ["$joinTeam._id", ""] },
          team_id: { $ifNull: ["$joinTeam.team_id", ""] },
          match_id: { $ifNull: ["$joinTeam.match_id", ""] },
          user_id: { $ifNull: ["$joinTeam.user_id", ""] },
          cid: { $ifNull: ["$joinTeam.cid", ""] },
          team_name: { $ifNull: ["$joinTeam.team_name", ""] },
          captain: { $ifNull: ["$joinTeam.captain", ""] },
          vice_captain: { $ifNull: ["$joinTeam.vice_captain", ""] },
          wk: { $ifNull: ["$joinTeam.wk", ""] },
          bat: { $ifNull: ["$joinTeam.bat", ""] },
          ar: { $ifNull: ["$joinTeam.ar", ""] },
          bowl: { $ifNull: ["$joinTeam.bowl", ""] },
          teama_number: { $ifNull: ["$joinTeam.teama_number", ""] },
          teamb_number: { $ifNull: ["$joinTeam.teamb_number", ""] },
          total_point: { $ifNull: ["$joinTeam.total_point", ""] },
          user_logo_url: { $ifNull: ["$joinTeam.user_logo_url", ""] },
          description: { $ifNull: ["$joinTeam.description", ""] },
          rank: {
            $cond: {
              if: { $ne: ["$joinTeam.results", []] },
              then: { $arrayElemAt: ["$joinTeam.results.team_rank", 0] },
              else: "", // or specify a default value if results array is empty
            },
          },
          actual_rank: {
            $cond: {
              if: { $ne: ["$joinTeam.results", []] },
              then: { $arrayElemAt: ["$joinTeam.results.team_actual_rank", 0] },
              else: "", // or specify a default value if results array is empty
            },
          },
          winnings_amount: {
            $cond: {
              if: { $ne: ["$joinTeam.results", []] },
              then: { $arrayElemAt: ["$joinTeam.results.winnings_amount", 0] },
              else: "", // or specify a default value if results array is empty
            },
          },
          winnings_message: {
            $cond: {
              if: { $ne: ["$joinTeam.results", []] },
              then: { $arrayElemAt: ["$joinTeam.results.winnings_message", 0] },
              else: "", // or specify a default value if results array is empty
            },
          },
          isUp: {
            $cond: {
              if: { $ne: ["$joinTeam.results", []] },
              then: { $arrayElemAt: ["$joinTeam.results.isUp", 0] },
              else: "", // or specify a default value if results array is empty
            },
          },
        },
      },

      {
        $sort: { total_point: -1 }, // (1 for ascending, -1 for descending)
      },
    ]);

    let team = [];
    getLeaderBoard.forEach((match) => {
      team.push(match);
    });
    res.status(200).json({
      status: 1,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = { leaderboard };
