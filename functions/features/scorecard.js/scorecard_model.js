const mongoose = require("mongoose");
const ScorecardSchema = mongoose.Schema(
  {
    match_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    short_title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    match_number: {
      type: String,
    },
    format_str: {
      type: String,
    },
    status_note: {
      type: String,
    },
    game_state_str: {
      type: String,
    },
    game_state_str: {
      type: String,
    },
    live: {
      type: String,
    },
    winning_team_id: {
      type: String,
    },
    latest_inning_number: {
      type: String,
    },
    toss: {
      type: Object,
    },
    inning1: {
      type: [Object],
    },
    inning2: {
      type: [Object],
    },
  },
  { timestamps: true }
);

const Scorecard = mongoose.model("Scorecard", ScorecardSchema);

module.exports = Scorecard;
