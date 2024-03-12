const api_collection = require("../api_collection/api_collection");
const axios = require("axios");
const MatchList = require("../../match/match_list_model");
const cron = require("node-cron");

const matchList = async (req, res) => {
  try {
    // console.log(req.query.match_status);
    let matchStatus = 1;
    if (req.query.match_status) matchStatus = req.query.match_status;
    const match_list_endpoint = `${api_collection.match_list_api}&status=${matchStatus}`;
     console.log("match_list_endpoint", match_list_endpoint);
    const response = await axios.get(match_list_endpoint);
    if (
      !response ||
      !response.data ||
      !response.data.response ||
      !response.data.response.items
    ) {
      return res.status(404).send("error in getting fields inside response");
    }
    let items = response.data.response.items;
    items.forEach(async (item) => {
      let fetchMatch = await MatchList.find({
        match_id: item.match_id,
      }).select("match_id");

      let matchList;
      if (fetchMatch.length === 0) {
        matchList = new MatchList({
          match_id: item.match_id,
          cid: item.competition.cid,
          title: item.title,
          short_title: item.short_title,
          status: item.status,
          status_str: item.status_str,
          status_note: item.status_note,
          verified: item.verified,
          pre_squad: item.pre_squad,
          competition_title: item.competition.title,
          competition_abbr: item.competition.abbr,
          competition_type: item.competition.type,
          competition_country: item.competition.country,
          teama_id: item.teama.id,
          teama_name: item.teama.name,
          teama_short_name: item.teama.short_name,
          teama_logo_url: item.teama.logo_url,
          teama_scores_full: item.teama.scores_full,
          teama_scores: item.teama.scores,
          teama_overs: item.teama.overs,
          teamb_id: item.teamb.id,
          teamb_name: item.teamb.name,
          teamb_short_name: item.teamb.short_name,
          teamb_logo_url: item.teamb.logo_url,
          teamb_scores_full: item.teamb.scores_full,
          teamb_scores: item.teamb.scores,
          teamb_overs: item.teamb.overs,
          date_start: item.date_start,
          date_end:  item.date_end,
          date_start_ist: item.date_start_ist,
          date_end_ist: item.date_end_ist,
          venue_name: item.venue.name,
          venue_location: item.venue.location,
          venue_country: item.venue.country,
          venue_timezone: item.venue.timezone,
          umpires: item.umpires,
          referee: item.referee,
          live: item.live,
          result: item.result,
          winning_team_id: item.winning_team_id,
          commentry: item.commentry,
          presquad_time: item.presquad_time,
          verify_time: item.verify_time,
          toss_text: item.toss.text,
          toss_winner: item.toss.winner,
          toss_decision: item.toss.decision,
        });
        await matchList.save();
      } else {

        matchList = await MatchList.findOneAndUpdate(
          { match_id: item.match_id },
          {
            $set: {
              match_id: item.match_id,
              cid: item.competition.cid,
              title: item.title,
              short_title: item.short_title,
              status: item.status,
              status_str: item.status_str,
              status_note: item.status_note,
              verified: item.verified,
              pre_squad: item.pre_squad,
              competition_title: item.competition.title,
              competition_abbr: item.competition.abbr,
              competition_type: item.competition.type,
              competition_country: item.competition.country,
              teama_id: item.teama.id,
              teama_name: item.teama.name,
              teama_short_name: item.teama.short_name,
              teama_logo_url: item.teama.logo_url,
              teama_scores_full: item.teama.scores_full,
              teama_scores: item.teama.scores,
              teama_overs: item.teama.overs,
              teamb_id: item.teamb.id,
              teamb_name: item.teamb.name,
              teamb_short_name: item.teamb.short_name,
              teamb_logo_url: item.teamb.logo_url,
              teamb_scores_full: item.teamb.scores_full,
              teamb_scores: item.teamb.scores,
              teamb_overs: item.teamb.overs,
              date_start: item.date_start,
              date_end: item.date_start,
              date_start_ist: item.date_start_ist,
              date_end_ist: item.date_end_ist,
              venue_name: item.venue.name,
              venue_location: item.venue.location,
              venue_country: item.venue.country,
              venue_timezone: item.venue.timezone,
              umpires: item.umpires,
              referee: item.referee,
              live: item.live,
              result: item.result,
              winning_team_id: item.winning_team_id,
              commentry: item.commentry,
              presquad_time: item.presquad_time,
              verify_time: item.verify_time,
              toss_text: item.toss.text,
              toss_winner: item.toss.winner,
              toss_decision: item.toss.decision,
            },
          }
        );
        await matchList.save();
      }
    });
    res.status(200).json({
      status: 1,
      message: "fetch successfully",
    });
  } catch (error) {
    console.log("error in getting response", error);
    res.status(500).send(error.message);
  }
};

// const fetchMatch = async() => {
//     let matchStatus = 1;
//     const match_list_endpoint = `${api_collection.match_list_api}&status=${matchStatus}`;
//     const response = await axios.get(match_list_endpoint);
//     if (
//       !response ||
//       !response.data ||
//       !response.data.response ||
//       !response.data.response.items
//     ) {
//       return res.status(404).send("error in getting fields inside response");
//     }
//     let items = response.data.response.items;
//     items.forEach(async (item) => {
//       let fetchMatch = await MatchList.find({
//         match_id: item.match_id,
//       }).select("match_id");

//       let matchList;
//       if (fetchMatch.length === 0) {
//         matchList = new MatchList({
//           match_id: item.match_id,
//           cid: item.competition.cid,
//           title: item.title,
//           short_title: item.short_title,
//           status: item.status,
//           status_str: item.status_str,
//           status_note: item.status_note,
//           verified: item.verified,
//           pre_squad: item.pre_squad,
//           competition_title: item.competition.title,
//           competition_abbr: item.competition.abbr,
//           competition_type: item.competition.type,
//           competition_country: item.competition.country,
//           teama_id: item.teama.id,
//           teama_name: item.teama.name,
//           teama_short_name: item.teama.short_name,
//           teama_logo_url: item.teama.logo_url,
//           teama_scores_full: item.teama.scores_full,
//           teama_scores: item.teama.scores,
//           teama_overs: item.teama.overs,
//           teamb_id: item.teamb.id,
//           teamb_name: item.teamb.name,
//           teamb_short_name: item.teamb.short_name,
//           teamb_logo_url: item.teamb.logo_url,
//           teamb_scores_full: item.teamb.scores_full,
//           teamb_scores: item.teamb.scores,
//           teamb_overs: item.teamb.overs,
//           date_start: item.date_start,
//           date_end: item.date_end,
//           venue_name: item.venue.name,
//           venue_location: item.venue.location,
//           venue_country: item.venue.country,
//           venue_timezone: item.venue.timezone,
//           umpires: item.umpires,
//           referee: item.referee,
//           live: item.live,
//           result: item.result,
//           winning_team_id: item.winning_team_id,
//           commentry: item.commentry,
//           presquad_time: item.presquad_time,
//           verify_time: item.verify_time,
//           toss_text: item.toss.text,
//           toss_winner: item.toss.winner,
//           toss_decision: item.toss.decision,
//         });
//         await matchList.save();
//       } else {
//         matchList = await MatchList.findOneAndUpdate(
//           { match_id: item.match_id },
//           {
//             $set: {
//               match_id: item.match_id,
//               cid: item.competition.cid,
//               title: item.title,
//               short_title: item.short_title,
//               status: item.status,
//               status_str: item.status_str,
//               status_note: item.status_note,
//               verified: item.verified,
//               pre_squad: item.pre_squad,
//               competition_title: item.competition.title,
//               competition_abbr: item.competition.abbr,
//               competition_type: item.competition.type,
//               competition_country: item.competition.country,
//               teama_id: item.teama.id,
//               teama_name: item.teama.name,
//               teama_short_name: item.teama.short_name,
//               teama_logo_url: item.teama.logo_url,
//               teama_scores_full: item.teama.scores_full,
//               teama_scores: item.teama.scores,
//               teama_overs: item.teama.overs,
//               teamb_id: item.teamb.id,
//               teamb_name: item.teamb.name,
//               teamb_short_name: item.teamb.short_name,
//               teamb_logo_url: item.teamb.logo_url,
//               teamb_scores_full: item.teamb.scores_full,
//               teamb_scores: item.teamb.scores,
//               teamb_overs: item.teamb.overs,
//               date_start: item.date_start,
//               date_end: item.date_start,
//               venue_name: item.venue.name,
//               venue_location: item.venue.location,
//               venue_country: item.venue.country,
//               venue_timezone: item.venue.timezone,
//               umpires: item.umpires,
//               referee: item.referee,
//               live: item.live,
//               result: item.result,
//               winning_team_id: item.winning_team_id,
//               commentry: item.commentry,
//               presquad_time: item.presquad_time,
//               verify_time: item.verify_time,
//               toss_text: item.toss.text,
//               toss_winner: item.toss.winner,
//               toss_decision: item.toss.decision,
//             },
//           }
//         );
//         await matchList.save();
//       }
//     });
// }

// cron.schedule("*/1 * * * *", async () => {
//   try {
//     console.log("Running matchList function...");
//     await fetchMatch(); // Call your matchList function
//   } catch (error) {
//     console.error("Error in matchList function:", error);
//   }
// });

module.exports = { matchList };
