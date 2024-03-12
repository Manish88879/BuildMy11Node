
const Contest = require('./../contest/contest_model');
const JoinContest = require('./join_contest_model');
const User = require('./../user/user_model');
const Team = require('./../team/team_model');
const Match = require('./../match/match_list_model');
const Wallet = require('./../wallet/wallet_model');
const crypto = require("crypto");


const createJoinContest = async (req, res) => {
    try {
        const { user_id, contest_id, team_id, match_id } = req.body;

        if (!user_id || !contest_id || !team_id || !match_id) {
            return res.json({
                status: 0,
                message: "all fields are mandatory",
            });
        }
        const user = await User.findOne({ _id: user_id });
        // console.log("user", user);

        if (!user) {
            return res.json({
                status: 0,
                message: "User is not valid",
            });
        }
        const contest = await Contest.findOne({ contest_id: contest_id });
        // console.log("contest", contest);

        if (!contest) {
            return res.json({
                status: 0,
                message: "Contest not found",
            });
        }

        const team = await Team.findOne({ team_id: team_id });
        // console.log("team", team);

        if (!team) {
            return res.json({
                status: 0,
                message: "Team not found",
            });
        }
        const match = await Match.findOne({match_id: match_id, status: 1});
        // console.log('match', match);
        if (!match) {
            return res.json({
                status: 0,
                message: "match not found",
            });
        }

        const contestCheck = await Contest.findOne({ contest_id, size_left: { $ne: 0 } })
        // .select(
        //     "size_left", "entry_fee"
        // );
        // console.log("contestCheck", contestCheck);

        if (contestCheck) {
            const joinContest = await JoinContest.findOne({ user_id: user_id, contest_id: contest_id, team_id: team_id });
            if (joinContest) {
                return res.json({
                    status: 0,
                    message: 'already joined with this team',
                })
            } else {
              //wallet
              const findWalletDetails = await Wallet.findOne({
                user_id: user_id,
              }).sort({ _id: -1 });
              let fetch_balance = 0;
              if (findWalletDetails) {
                fetch_balance = findWalletDetails.new_balance;
              }
              if(fetch_balance < 1){
                 return res.json({
                   status: 0,
                   message: "Insufficient balance",
                 });
              }
              let privious_balance = fetch_balance;
              let new_balance = fetch_balance - contestCheck.entry_fee;

              let walletId = generateWalletID(user_id);
              // console.log(privious_balance, new_balance, walletId);

              const wallet = new Wallet({
                wallet_id: walletId,
                user_id: user_id,
                remark: "deduct balance",
                type: "2",
                privious_balance: privious_balance,
                upload_balance: contestCheck.entry_fee,
                new_balance: new_balance,
              });
              wallet.save();

              //user
              await User.findOneAndUpdate(
                { _id: user_id },
                {
                  $set: {
                    wallet: new_balance,
                  },
                }
              );

              //create join contest
              const joinContest = new JoinContest({
                user_id: user_id,
                match_id: match_id,
                contest_id: contest_id,
                team_id: team_id,
                createdAt: Date.now(),
              });
              joinContest.save();

              //contest
              await Contest.findOneAndUpdate(
                { contest_id: contest_id },
                {
                  $set: {
                    size_left: contestCheck.size_left - 1,
                  },
                }
              );

              return res.status(200).json({
                status: 1,
                message: "Success",
              });
            }
        } else {
            res.json({
                status: 0,
                message: "Contest Full or Not found",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message,
        })
    }
}



function generateWalletID(userID) {
    userID = userID.slice(-4);
    const randomString = crypto.randomBytes(4).toString("hex"); // Generate a random string
    const walletID = `W-${userID}-${randomString}`;
    return walletID;
}

module.exports = {createJoinContest}