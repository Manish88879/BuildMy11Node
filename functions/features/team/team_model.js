const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    team_id: {
      type: "string",
      required: true,
      unique: true,
    },
    match_id: {
      type: "string",
      required: true,
    },
    user_id: {
      type: "string",
      required: true,
    },
    cid: {
      type: "string",
      required: true,
    },
    team_name: {
      type: "string",
    },
    // players: {
    //   type: [Object],
    // },
    captain: {
      type: String,
    },
    vice_captain: {
      type: String,
    },
    // points: {
    //   type: Number,
    //   default: 0,
    // },
    wk: {
      type: Number,
    },
    bat: {
      type: Number,
    },
    ar: {
      type: Number,
    },
    bowl: {
      type: Number,
    },
    teama_number: {
      type: Number,
      default: 0,
    },
    teamb_number: {
      type: Number,
      default: 0,
    },
    total_point: {
      type: Number,
      default: 0,
    },
    user_logo_url: {
      type: String,
      default: "https://buildmy11.com/playerimage/default.png",
    },
    description: {
      type: String,
      default: " ",
    },
    //rank: {
    //  type: Number,
    // default: 0,
    //},
    // actual_rank: {
    //   type: Number,
    //   default: 0,
    // },
    // winnings_amount: {
    //   type: String,
    // },
    // winnings_message: {
    //   type: String,
    // },
    createdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team1", TeamSchema);
module.exports = Team;
