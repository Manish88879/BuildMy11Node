const mongoose = require("mongoose");
const FantasyMatchSquadPlayerSchema = mongoose.Schema(
  {
    match_id: {
      type: "string",
      require: true,
    },
    cid: {
      type: "string",
      require: true,
    },
    team_id: {
      type: "string",
      // require: true,
    },
    team_name: {
      type: "string",
    },
    team_logo: {
      type: "string",
    },
    team_abbr: {
      type: "string",
    },
    pid: {
      type: "string",
      require: true,
    },
    title: {
      type: "string",
    },
    short_name: {
      type: "string",
    },
    first_name: {
      type: "string",
    },
    last_name: {
      type: "string",
    },
    middle_name: {
      type: "string",
    },
    birthdate: {
      type: "string",
    },
    birthplace: {
      type: "string",
    },
    country: {
      type: "string",
    },
    logo_url: {
      type: "string",
    },
    playing_role: {
      type: "string",
    },
    batting_style: {
      type: "string",
    },
    bowling_style: {
      type: "string",
    },
    fielding_position: {
      type: "string",
    },
    recent_match: {
      type: "string",
    },
    recent_appearance: {
      type: "string",
    },
    fantasy_player_rating: {
      type: "string",
    },
    alt_name: {
      type: "string",
    },
    facebook_profile: {
      type: "string",
    },
    twitter_profile: {
      type: "string",
    },
    instagram_profile: {
      type: "string",
    },
    debut_data: {
      type: "string",
    },
    thumb_url: {
      type: "string",
    },
    nationality: {
      type: "string",
    },
    is_last_match_played: {
      type: Boolean,
    },
    playing11: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
    },
  },
  { timeStamp: true }
);

const Player = mongoose.model("Player1", FantasyMatchSquadPlayerSchema);
module.exports = Player;
