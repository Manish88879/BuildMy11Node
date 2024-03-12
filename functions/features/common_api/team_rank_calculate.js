const MatchList = require("../match/match_list_model");
const Team = require("../team/team_model");

const teamRank = async (req, res) => {
  try {
    const findMatch = await MatchList.find({ status: "3" });
    findMatch.forEach(async (match) => {
      const pipeline = [
        {
          $match: { match_id: match.match_id }, // Filter by match_id
        },
      ];
      const totalPointsPerTeam = await Team.aggregate(pipeline);

      totalPointsPerTeam.sort((a, b) => b.total_point - a.total_point);

      // Calculate the rank for each team
      totalPointsPerTeam.forEach((teamData, index) => {
        teamData.rank = index + 1;
      });
      // Update the Team collection with the totalPoints
      const bulkOps = totalPointsPerTeam.map((teamData) => ({
        
        updateOne: {
          filter: { team_id: teamData.team_id },
          update: { $set: { rank: teamData.rank } },
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
module.exports = { teamRank };
