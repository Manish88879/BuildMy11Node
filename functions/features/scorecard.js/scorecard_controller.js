const MatchList = require("./../match/match_list_model");
const Scorecard = require("./scorecard_model");
const api_collection = require("./../third_party_api/api_collection/api_collection");
const axios = require("axios");
const Team = require('./../team/team_model')
const joinContest = require('./../join_contest/join_contest_model');
const JoinedContest = require("./../join_contest/join_contest_model");
const fetchScorecard = async (req, res) => {
  try {
    const liveMatch = await MatchList.find({ status: "3" });
    if (liveMatch.length) {
      // Use Promise.all to wait for all Axios requests to complete
      const scorecardPromises = liveMatch.map(async (match) => {
        const match_id = match.match_id;
        const scorecardApiPath = `${api_collection.match_scorecard_api}${match_id}/scorecard?token=${process.env.third_party_api_token}`;
        return axios.get(scorecardApiPath);
      });

      const responses = await Promise.all(scorecardPromises);

      responses.forEach(async (response) => {
        let data = response?.data?.response;
        const scorecard = await Scorecard.updateOne(
          { match_id: data.match_id }, // Corrected to use data.match_id
          {
            $set: {
              match_id: data.match_id,
              title: data.title,
              short_title: data.short_title,
              subtitle: data.subtitle,
              match_number: data.match_number,
              format_str: data.format_str,
              status_note: data.status_note,
              game_state_str: data.game_state_str,
              live: data.live,
              winning_team_id: data.winning_team_id,
              latest_inning_number: data.latest_inning_number,
              toss: data.toss,
              inning1: data?.innings[0] || "",
              inning2: data?.innings[1] || "",
            },
          },
          { upsert: true }
        );
      });
    }

    res.status(200).json({
      status: 1,
      message: "Scorecards created successfully",
    });
  } catch (error) {
    // Handle Axios errors here
    console.error("Axios error:", error);
    res.status(500).json({ status: 0, message: "Internal server error" });
  }
};

const getScorecardAtMatchLevel = async (req, res) => {
  try {
    const match_id = req.query.match_id;
    const user_id = req.query.user_id;
    if (!match_id || !user_id) {
      return res
        .status(400)
        .json({ status: 0, message: "match_id and user_id are required" });
    }
    const findScorecard = await Scorecard.find({ match_id: match_id });
     const findTeamPlayersOfMatch = await Team.aggregate([
       {
         $match: { match_id: match_id, user_id: user_id },
       },
       {
         $lookup: {
           from: "teamplayers",
           localField: "team_id",
           foreignField: "team_id",
           as: "players",
         },
       },
     ]);
    res.status(200).json({
      status: 1,
      scorecard: findScorecard,
      teamData: findTeamPlayersOfMatch,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

const getScorecardAtContestLevel = async (req, res) => {
  try {
    const match_id = req.query.match_id;
    const user_id = req.query.user_id;
    const contest_id = req.query.contest_id;
    if (!match_id || !user_id || !contest_id) {
      return res
        .status(400)
        .json({ status: 0, message: "match_id, user_id and !contestid are required" });
    }
    const findScorecard = await Scorecard.find({ match_id: match_id });
    const findTeamPlayersOfContest = await JoinedContest.aggregate([
      {
        $match: {match_id, user_id, contest_id },
      },
      {
        $lookup: {
          from: "team1",
          localField: "team_id",
          foreignField: "team_id",
          as: "players",
        },
      },
    ]);
    res.status(200).json({
      status: 1,
      scorecard: findScorecard,
      teamData: findTeamPlayersOfContest,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

module.exports = {
  fetchScorecard,
  getScorecardAtMatchLevel,
  getScorecardAtContestLevel,
};
