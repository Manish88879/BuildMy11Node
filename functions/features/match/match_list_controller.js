const MatchList = require("./match_list_model");
const JoinContest = require("./../join_contest/join_contest_model");

const getMatchList = async (req, res) => {
  try {
    let Data = [];
    const currentDateTime = getCurrentDateTimeFormatted();
    const matches = await MatchList.find({
      status: '1',
      date_start_ist: { $gte: currentDateTime },
    });
    matches.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
    return res.json({
      status: 1,
      message: "success",
      data: matches,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const myMatchList = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      return res.status(400).json({
        status: 0,
        message: "user_id is required",
      });
    }
    const findMatch = await JoinContest.aggregate([
      {
        $match: { user_id: user_id },
      },
      {
        $group: {
          _id: null, // Group all documents together
          match_id: { $addToSet: "$match_id" }, // Collect distinct match_id values
        },
      },
      {
        $lookup: {
          from: "matchlists",
          localField: "match_id",
          foreignField: "match_id",
          as: "matches",
        },
      },
    ]);

    const findWinContest = await JoinContest.aggregate([
      {
        $match: {
          user_id: user_id,
          team_id: { $exists: true },
          contest_id: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "results",
          let: { teamId: "$team_id", contestId: "$contest_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$team_id", "$$teamId"] },
                    { $eq: ["$contest_id", "$$contestId"] },
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
          winningsGreaterThanZeroCount: {
            $size: {
              $filter: {
                input: "$results",
                as: "result",
                cond: { $gt: [{ $toDouble: "$$result.winnings_amount" }, 0] },
              },
            },
          },
        },
      },
      {
        $match: {
          winningsGreaterThanZeroCount: 1,
        },
      },
    ]);


    // console.log(findWinContest);
    const totalContest = findMatch[0]?.match_id?.length || 0;
    const totalMatch = findMatch[0]?.matches?.length || 0;
    const winContest = findWinContest?.length || 0;
    let packet = [];
    if (findMatch.length && findMatch[0].matches) {
      findMatch[0].matches.forEach((value) => {
        packet.push(value);
      });
    } 
    packet.sort((a, b) => {
      const dateA = new Date(a.date_start);
      const dateB = new Date(b.date_start);
      return dateB - dateA; // Use "return" to compare and sort
    });
    res.json({
      status: 1,
      message: "success",
      totalContest: totalContest,
      totalMatch: totalMatch,
      winContest: winContest,
      data: packet,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const findMatchDetailWithMatchIdAndCID = async(req, res) => {
  try {
    const match_id = req.query.match_id;
    const cid = req.query.cid;
    if(!match_id || !cid){
      return res.status(400).json({
        status: 0,
        message: 'match_id and cid are required',
      });
    }
    const findMatch = await MatchList.findOne({match_id: match_id, cid: cid});
    if(!findMatch){return res.status(404).json({status: 0, message: 'match not found'})};
    return res.status(200).json({status: 1, data: findMatch});
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    })
    
  }
}

function getCurrentDateTimeFormatted() {
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = String(currentDateTime.getMonth() + 1).padStart(2, "0");
  const day = String(currentDateTime.getDate()).padStart(2, "0");
  const hours = String(currentDateTime.getHours()).padStart(2, "0");
  const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}

module.exports = {
  getMatchList,
  myMatchList,
  findMatchDetailWithMatchIdAndCID,
};
