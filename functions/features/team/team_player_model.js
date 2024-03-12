const mongoose = require("mongoose");

const TeamPlayerSchema = new mongoose.Schema(
  {
    player_id: {
      type: String,
      required: true,
    },
    team_id: {
      type: String,
      required: true,
    },
    match_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
    },
    cid: {
      type: String,
      required: true,
    },
    pid: {
      type: String,
    },
    team_name: {
      type: String,
    },
    team_logo: {
      type: String,
    },
    team_abbr: {
      type: String,
    },
    title: {
      type: String,
    },
    short_name: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    middle_name: {
      type: String,
    },
    birthdate: {
      type: String,
    },
    birthplace: {
      type: String,
    },
    country: {
      type: String,
    },
    logo_url: {
      type: String,
    },
    playing_role: {
      type: String,
    },
    batting_style: {
      type: String,
    },
    bowling_style: {
      type: String,
    },
    fielding_position: {
      type: String,
    },
    recent_match: {
      type: String,
    },
    recent_appearance: {
      type: String,
    },
    fantasy_player_rating: {
      type: String,
    },
    alt_name: {
      type: String,
    },
    facebook_profile: {
      type: String,
    },
    twitter_profile: {
      type: String,
    },
    instagram_profile: {
      type: String,
    },
    debut_data: {
      type: String,
    },
    thumb_url: {
      type: String,
    },
    nationality: {
      type: String,
    },
    is_last_match_played: {
      type: Boolean,
    },
    playing11: {
      type: Boolean,
    },
    is_selected: {
      type: Boolean,
    },
    isViceCaptain: {
      type: Boolean,
    },
    isCaptain: {
      type: Boolean,
    },
    player_point: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const TeamPlayer = mongoose.model("TeamPlayer", TeamPlayerSchema);
module.exports = TeamPlayer;
