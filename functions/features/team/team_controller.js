const Team = require("./team_model");
const crypto = require("crypto");
const TeamPlayer = require("./team_player_model");
const User = require("./../user/user_model");

const createTeam = async (req, res) => {
  try {
    let {
      match_id,
      user_id,
      cid,
      team_name,
      captain,
      vice_captain,
      // points,
      player_details,
      wk,
      bat,
      ar,
      bowl,
    } = req.body;

    if ((!match_id || !user_id, !cid)) {
      return res.status(400).json({
        status: 0,
        message: "match_id, user_id and cid are required",
      });
    }
    const teamExist = await Team.findOne({ match_id, user_id, cid, team_name });
    if (teamExist) {
      return res.status(400).json({
        status: 0,
        message: "team already exists",
      });
    }
    const team_id = generateTeamID(user_id);
    if (player_details.length) player_details = JSON.parse(player_details);
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res
        .status(404)
        .json({ status: 0, message: "can not find user according to user id" });
    }

    const team = new Team({
      team_id: team_id,
      match_id: match_id,
      user_id: user_id,
      cid: cid,
      team_name: team_name,
      captain: captain,
      vice_captain: vice_captain,
      // points: points,
      // players: player_details,
      wk: wk,
      bat: bat,
      ar: ar,
      bowl: bowl,
      user_logo_url: user.profile_pic,
    });
    await team.save();
    if (player_details.length) {
      for (const player of player_details) {
        const teamPlayer = new TeamPlayer({
          player_id: player._id,
          team_id: team_id,
          user_id: user_id,
          match_id: match_id,
          cid: cid,
          pid: player.pid,
          team_name: team_name,
          team_logo: player.team_logo,
          team_abbr: player.team_abbr,
          title: player.title,
          short_name: player.short_name,
          first_name: player.first_name,
          last_name: player.last_name,
          middle_name: player.middle_name,
          birthdate: player.birthdate,
          birthplace: player.birthplace,
          country: player.country,
          logo_url: player.logo_url,
          playing_role: player.playing_role,
          batting_style: player.batting_style,
          bowling_style: player.bowling_style,
          fielding_position: player.fielding_position,
          recent_match: player.recent_match,
          recent_appearance: player.recent,
          fantasy_player_rating: player.fantasy_player_rating,
          alt_name: player.alt_name,
          facebook_profile: player.facebook_profile,
          twitter_profile: player.twitter_profile,
          instagram_profile: player.instagram_profile,
          debut_data: player.debut_data,
          thumb_url: player.thumb_url,
          nationality: player.nationality,
          is_last_match_played: player.is_last_match_played,
          playing11: player.playing11,
          is_selected: player.is_selected,
          isViceCaptain: player.isViceCaptain,
          isCaptain: player.isCaptain,
          player_point: player.player_point,
        });
        await teamPlayer.save();
      }
    }
    res.status(200).json({
      status: 1,
      team_id: team_id,
      message: "team created",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

function generateTeamID(userID) {
  userID = userID.slice(-4);
  const randomString = crypto.randomBytes(4).toString("hex"); // Generate a random string
  const teamID = `TEAM-${userID}-${randomString}`;
  return teamID;
}

const getTeamList = async (req, res) => {
  try {
    const match_id = req.query.match_id;
    const user_id = req.query.user_id;
    if (!match_id || !user_id) {
      return res.status(400).json({
        status: 0,
        message: "match_id and user_id are required",
      });
    }

    const findTeam = await Team.aggregate([
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
      team_list: findTeam,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const getTeamDetails = async (req, res) => {
  try {
    const team_id = req.query.team_id;
    if (!team_id) {
      return res.status(400).json({
        status: 0,
        message: "team_id is required",
      });
    }
    const findTeam = await Team.aggregate([
      { $match: { team_id: team_id } },
      {
        $lookup: {
          from: "teamplayers",
          localField: "team_id",
          foreignField: "team_id",
          as: "TeamPlayers",
        },
      },
    ]);
    // const findTeam = await Team.findOne({
    //   team_id: team_id,
    // });
    // if (!findTeam) {
    //   return res.status(404).json({
    //     status: 0,
    //     message: "Team not found",
    //   });
    // }
    res.status(200).json({
      status: 1,
      data: findTeam,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = { createTeam, getTeamList, getTeamDetails };
