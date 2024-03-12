// 1. Match List API - List of managed fantasy credit and role matches.
module.exports.match_list_api = `https://rest.entitysport.com/v2/matches/?per_page=50&pre_squad=true&token=${process.env.third_party_api_token}`;
// 2. Fantasy Match Roaster API - Please use this API endpoint for fantasy squads of both teams.
module.exports.fantasy_match_squad_api = `https://rest.entitysport.com/v2/competitions/`;
// 3. Match Playing11 API - Please use this API endpoint for Match Playing 11
module.exports.match_playing11_api = `https://rest.entitysport.com/v2/matches/`;
// 5. Match Fantasy Points API
module.exports.fantasy_points_api = `https://rest.entitysport.com/v2/matches/`;
// 6. match inning number api
module.exports.match_innings_commentry_api = `https://rest.entitysport.com/v2/matches/`;
// 7. Match Scorecard API 
module.exports.match_scorecard_api = `https://rest.entitysport.com/v2/matches/`;
//8. Gigadat
module.exports.gigadat_url =
  "https://interac.express-connect.com/";




// module.exports.match_list_api = `https://rest.entitysport.com/v2/matches/?status=2&token=${process.env.third_party_api_token}`;
//
// module.exports.competitions_list_api = `https://rest.entitysport.com/v2/competitions?token=${process.env.third_party_api_token}`;
// module.exports.match_info_api = `https://baseball.entitysport.com/matches/14281/info?token=${process.env.third_party_api_token}`;
// module.exports.match_live_api = `https://rest.entitysport.com/v2/matches/60397/live?token=${process.env.third_party_api_token}`;
// module.exports.fantasy_match_roaster_api = `https://rest.entitysport.com/v2/competitions/cid/squads/mid?token=[ACCESS_TOKEN]`;
// module.exports.match_squad_api = `https://rest.entitysport.com/v2/matches/mid/squads?token=${process.env.third_party_api_token}`;
// module.exports.match_scorecard_api = `https://rest.entitysport.com/v2/matches/49689/scorecard?token=${process.env.third_party_api_token}`;
// module.exports.match_fantasy_points_api = `https://rest.entitysport.com/v2/matches/mid/newpoint2?token=${process.env.third_party_api_token}`;
