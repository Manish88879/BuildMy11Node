const mongoose = require("mongoose");
const MatchListSchema = mongoose.Schema(
  {
    match_id: {
      type: "string",
      unique: true,
    },
    cid: {
      type: "string",
      // unique: true,
    },
    title: {
      type: "string",
    },
    short_title: {
      type: "string",
    },
    status: {
      type: "string",
    },
    status_str: {
      type: "string",
    },
    status_note: {
      type: "string",
    },
    verified: {
      type: Boolean,
    },
    pre_squad: {
      type: Boolean,
    },

    competition_title: {
      type: "string",
    },
    competition_abbr: {
      type: "string",
    },
    competition_type: {
      type: "string",
    },
    competition_country: {
      type: "string",
    },

    teama_id: {
      type: "string",
    },
    teama_name: {
      type: "string",
    },
    teama_short_name: {
      type: "string",
    },
    teama_logo_url: {
      type: "string",
    },
    teama_scores_full: {
      type: "string",
    },
    teama_scores: {
      type: "string",
    },
    teama_overs: {
      type: "string",
    },

    teamb_id: {
      type: "string",
    },
    teamb_name: {
      type: "string",
    },
    teamb_short_name: {
      type: "string",
    },
    teamb_logo_url: {
      type: "string",
    },
    teamb_scores_full: {
      type: "string",
    },
    teamb_scores: {
      type: "string",
    },
    teamb_overs: {
      type: "string",
    },

    date_start: {
      type: "string",
    },
    date_end: {
      type: "string",
    },
    date_start_ist: {
      type: "string",
    },
    date_end_ist: {
      type: "string",
    },

    venue_name: {
      type: "string",
    },
    venue_location: {
      type: "string",
    },
    venue_country: {
      type: "string",
    },
    venue_timezone: {
      type: "string",
    },

    umpires: {
      type: "string",
    },
    referee: {
      type: "string",
    },
    live: {
      type: "string",
    },
    result: {
      type: "string",
    },
    winning_team_id: {
      type: "string",
    },
    commentry: {
      type: "string",
    },
    presquad_time: {
      type: "string",
    },
    verify_time: {
      type: "string",
    },

    toss_text: {
      type: "string",
    },
    toss_winner: {
      type: "string",
    },
    toss_decision: {
      type: "string",
    },
  },
  { timeStamp: true }
);

const MatchList = mongoose.model("MatchList", MatchListSchema);
module.exports = MatchList;
