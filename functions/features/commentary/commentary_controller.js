const axios = require("axios");
const MatchList = require("../match/match_list_model");
const api_collection = require("../third_party_api/api_collection/api_collection");
const Commentary = require("./commentary_model");

const fetchCommentaryApi = async (req, res) => {
  try {
    const findMatch = await MatchList.find({ status: "3" });
    // console.log(findMatch);
    if (!findMatch.length) {
      return res.status(404).json({
        status: 0,
        message: 'no live match found',
      });
    }

    const commentaryPromises = findMatch.map(async (match) => {
      const match_id = match.match_id;
      // console.log(match_id);
      let inning1Commentary = [];
      let inning2Commentary = [];
      let inning1CommentaryApiPath = `${api_collection.match_innings_commentry_api}${match_id}/innings/1/commentary?token=${process.env.third_party_api_token}`;
      let inning2CommentaryApiPath = `${api_collection.match_innings_commentry_api}${match_id}/innings/2/commentary?token=${process.env.third_party_api_token}`;

      // console.log(inning1CommentryApiPath, inning2CommentryApiPath);

      const [inning1Res, inning2Res] = await Promise.all([
        axios.get(inning1CommentaryApiPath),
        axios.get(inning2CommentaryApiPath),
      ]);

      if (inning1Res?.data?.response?.commentaries) {
        inning1Commentary = inning1Res?.data?.response?.commentaries;
      }
      if (inning2Res?.data?.response?.commentaries) {
        inning2Commentary = inning2Res?.data?.response?.commentaries;
      }

      return Commentary.updateOne(
        { match_id },
        {
          $set: {
            match_id: match_id,
            inning1_commentary: inning1Commentary,
            inning2_commentary: inning2Commentary,
          },
        },
        { upsert: true }
      );
    });
    await Promise.all(commentaryPromises);
    res.status(200).json({
      status: 1,
      message: "commentaries save successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 0,
      message: error.message,
    })
  }
};

const getCommentaries = async (req, res) => {
  try {
    const match_id = req.query.match_id;
    if(!match_id){
      return res.status(400).json({
        status: 0,
        message: 'match_id is required'
      })
    }
    let Data = {
        inning1_commentary: [],
        inning2_commentary: [],
        match_id: "",
    };
    const findCommentaries = await Commentary.findOne({ match_id });
    if (!findCommentaries){
      return res.status(200).json({
        status: 1,
        data: Data,
      }); 
      
    }
      return res.status(200).json({
        status: 1,
        data: findCommentaries,
      }); 
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message
    })
  }
}


module.exports = { fetchCommentaryApi, getCommentaries };
