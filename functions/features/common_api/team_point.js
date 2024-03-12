const MatchList = require("./../match/match_list_model");
const Team = require("./../team/team_model");
const TeamPlayer = require("./../team/team_player_model");
const teamPoint = async (req, res) => {
  try {
    const findMatch = await MatchList.find({ status: "3" });
    findMatch.forEach(async (match) => {
      const pipeline = [
        {
          $match: { match_id: match.match_id }, // Filter by match_id
        },
        {
          $group: {
            _id: "$team_id",
            totalPoints: { $sum: "$player_point" },
          },
        },
      ];
      const totalPointsPerTeam = await TeamPlayer.aggregate(pipeline);
      console.log("totalPointsPerTeam", totalPointsPerTeam);
      // Update the Team collection with the totalPoints
      const bulkOps = totalPointsPerTeam.map((teamData) => ({
        updateOne: {
          filter: { team_id: teamData._id },
          update: { $set: { total_point: teamData.totalPoints } },
        },
      }));
      const result = await Team.bulkWrite(bulkOps);
    });
    res.status(200).json({
      status: 1,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
module.exports = { teamPoint };
