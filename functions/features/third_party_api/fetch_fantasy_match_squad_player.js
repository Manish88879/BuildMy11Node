const api_collection = require("./api_collection/api_collection");
const axios = require("axios");
const FantasyMatchSquadPlayer = require("../player/player_list_model");
module.exports.fantasyMatchSquadPlayer = async (cid, match_id) => {
  try {
    let fantasyMatchSquadPlayerPath = `${api_collection.fantasy_match_squad_api}${cid}/squads/${match_id}?token=${process.env.third_party_api_token}`;
    // console.log("fantasyMatchSquadPlayerPath", fantasyMatchSquadPlayerPath);
    const response = await axios.get(fantasyMatchSquadPlayerPath);
    let squads = response.data.response.squads;
    squads.forEach(async (squad) => {
      let players = squad.players;
      let lastMatchPlayed = squad.last_match_played;
      players.forEach(async (player) => {
        let is_last_match_played = true;
        let logo_url =
          player.logo_url || "https://buildmy11.com/playerimage/default.png";
        let isLastMatchPlayed = lastMatchPlayed.find(
          (lastM) => lastM.player_id == player.pid
        );
        if (isLastMatchPlayed == undefined) is_last_match_played = false;
        let fantasyMatchSquadPlayer = new FantasyMatchSquadPlayer({
          match_id: match_id,
          cid: cid,
          team_id: squad.team.tid,
          team_name: squad.team.title,
          team_logo: squad.team.logo_url,
          team_abbr: squad.team.abbr,
          pid: player.pid,
          title: player.title,
          short_name: player.short_name,
          first_name: player.first_name,
          last_name: player.last_name,
          middle_name: player.middle_name,
          birthdate: player.birthdate,
          birthplace: player.birthplace,
          country: player.country,
          logo_url: logo_url,
          playing_role: player.playing_role,
          batting_style: player.batting_style,
          bowling_style: player.bowling_style,
          fielding_position: player.fielding_position,
          recent_match: player.recent_match,
          recent_appearance: player.recent_appearance,
          fantasy_player_rating: player.fantasy_player_rating,
          alt_name: player.alt_name,
          facebook_profile: player.facebook_profile,
          twitter_profile: player.twitter_profile,
          instagram_profile: player.instagram_profile,
          debut_data: player.debut_data,
          thumb_url: player.thumb_url,
          nationality: player.nationality,
          is_last_match_played: is_last_match_played,
          createdAt: Date.now(),
        });
        await fantasyMatchSquadPlayer.save();
      });
    });

    return { status: 1, message: "success" };
  } catch (error) {
    return { status: 0, message: error.message };
  }

  return 0;
};
