const MatchList = require("./../match/match_list_model");
const JoinContest = require("./../join_contest/join_contest_model");
const Team = require("./../team/team_model");
const Result = require("./result_calculation_model");

const resultCalculate = async (req, res) => {
  try {
    const findLiveMatch = await MatchList.find({ status: "3" });
    for (match of findLiveMatch) {
      const joinContests = await JoinContest.aggregate([
        {
          $match: { match_id: match.match_id },
        },
        {
          $group: {
            _id: "$contest_id",
            user_id: { $first: "$user_id" },
            match_id: { $first: "$match_id" },
            contest_id: { $first: "$contest_id" },
            team_id: { $push: "$team_id" },
          },
        },
        {
          $lookup: {
            from: "contest1", // The name of the contest table
            localField: "_id", // Field from the previous $group stage
            foreignField: "contest_id", // Field to match in the contest table
            as: "contest_data", // Store the contest data in the contest_data field
          },
        },

        {
          $lookup: {
            from: "team1",
            localField: "team_id", // Field from the previous $group stage
            foreignField: "team_id",
            pipeline: [
              {
                $group: {
                  _id: "$total_point",
                  teams: { $push: "$$ROOT" },
                },
              },
              {
                $sort: {
                  _id: -1, // Sort by total_point in descending order
                },
              },
            ],
            as: "teams_data", // Store teams data in joinContests.teams
          },
        },

        {
          $project: {
            _id: 1, // Exclude the _id field if desired
            user_id: 1,
            match_id: 1,
            contest_id: 1,
            team_id: 1,
            contest_data: "$contest_data",
            teams_data: "$teams_data",
          },
        },
      ]);

      // console.log();

      for (const joinContest of joinContests) {
        let match_id = joinContest?.match_id;
        let contest_id = joinContest?.contest_id;
        let rank = 1;
        let actualRank = 1;
        let rankArray = joinContest?.contest_data[0]?.rank;
        let prizePoolPercent = joinContest?.contest_data[0]?.prize_pool_percent;
        let winnings_amount = joinContest?.contest_data[0]?.winnings_amount;
        // console.log("joinContests", joinContests[0].teams_data[0]);
        for (const point of joinContest?.teams_data) {
          let teamLenth = point?.teams?.length;

          //*************************

          let totalAmount = 0;
          let groupRank = actualRank;
          for (const teamgroup of point?.teams) {
            for (let i = 0; i < rankArray?.length; i++) {
              if (rankArray[i].includes("-")) {
                let parts = rankArray[i].split("-");
                let part_before_hyphen = parts[0];
                let part_after_hyphen = parts[1];
                if (
                  groupRank >= part_before_hyphen &&
                  groupRank <= part_after_hyphen
                ) {
                  totalAmount = totalAmount + Number(winnings_amount[i]);
                }
              } else {
                if (groupRank == rankArray[i]) {
                  totalAmount = totalAmount + Number(winnings_amount[i]);
                }
              }
            }
            groupRank++;
          }

          //************************ */

          for (const team of point?.teams) {
            // let position = -1;
            // for (let i = 0; i < rankArray?.length; i++) {
            //   if (rankArray[i].includes("-")) {
            //     let parts = rankArray[i].split("-");
            //     let part_before_hyphen = parts[0];
            //     let part_after_hyphen = parts[1];
            //     if (
            //       actualRank >= part_before_hyphen &&
            //       actualRank <= part_after_hyphen
            //     ) {
            //       position = i;
            //     }
            //   } else {
            //     if (actualRank == rankArray[i]) {
            //       position = i;
            //     }
            //   }
            // }
            let isUp = false;
            const result = await Result.findOne({
              match_id,
              contest_id,
              team_id: team.team_id,
            });
            if (result && result.actualRank >= actualRank) {
              isUp = true;
            }

            await Result.deleteMany({
              match_id,
              contest_id,
              team_id: team.team_id,
            });

            if (totalAmount != 0) {
              const result = new Result({
                match_id: match_id,
                contest_id: contest_id,
                team_id: team.team_id,
                team_rank: rank,
                team_actual_rank: actualRank,
                winnings_amount: totalAmount / teamLenth,
                winnings_message: "winning zone",
                isUp: isUp,
              });
              await result.save();
            } else {
              const result = new Result({
                match_id: match_id,
                contest_id: contest_id,
                team_id: team.team_id,
                team_rank: rank,
                team_actual_rank: actualRank,
                winnings_amount: 0,
                winnings_message: " ",
                isUp: false,
              });
              await result.save();
            }
            actualRank++;
          }
          rank++;
        }
      }
    }

    res.status(200).json({
      status: 1,
      message: "Success",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
// resultCalculate();
module.exports = { resultCalculate };
