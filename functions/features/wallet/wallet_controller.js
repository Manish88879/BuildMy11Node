const Wallet = require("./wallet_model");
const User = require("./../user/user_model");
const crypto = require("crypto");
const axios = require("axios");
const btoa = require("btoa");
const api_collection = require("./../third_party_api/api_collection/api_collection");
const Transaction = require("./transaction_model");
const CheckRes = require("./checkResDB");
const sendEmail = require("./../../middlewares/nodemailer");

const checkStatusOfPayment = async (req, res) => {
  try {
    // const user_id = req.query.user_id;
    const transactionId = req.query.transaction_id;
    const transaction = await Transaction.findOne({ transactionId });

    // const mailOptions = {
    //   from: "kanhaiya@aetherss.com",
    //   to: transaction?.email,
    //   subject: "ADD BALANCE / WITHDRAW BALANCE",
    //   text: `Your Payment status is: ${transaction?.status}\n\n`,
    // };
    // sendEmail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //   }
    //   console.log("Email sent:", info.response);
    // });
    res.status(200).json({
      status: 1,
      paymentStatus: transaction?.status || "",
      amount: transaction?.amount || " ",
    });
  } catch (error) {
    res.status(500).json({
      satus: 0,
      message: error?.message,
    });
  }
};

// const withdrawBalance = async (req, res) => {
//   try {
//     let { user_id, amount } = req.body;
//     const findUser = await User.findOne({ _id: user_id });
//     if (!findUser) {
//       return res.status(404).json({ status: 0, message: "User not found" });
//     }

//     const findWalletDetails = await Wallet.findOne({ user_id: user_id }).sort({
//       _id: -1,
//     });

//     if (findWalletDetails && amount > findWalletDetails.new_balance) {
//       return res.status(400).json({
//         status: 0,
//         message: "insufficient funds",
//       });
//     }

//     let privious_balance = 0.0;

//     if (findWalletDetails) {
//       privious_balance = findWalletDetails.new_balance;
//     }

//     let new_balance = 0.0;
//     new_balance = Number(
//       parseFloat(privious_balance) - parseFloat(amount)
//     ).toFixed(2);

//     const wallet_id = generateWalletID(user_id);

//     const wallet = new Wallet({
//       wallet_id: wallet_id,
//       user_id: user_id,
//       remark: "withdraw balance",
//       type: 2,
//       privious_balance: privious_balance,
//       new_balance: new_balance,
//       withdraw_balance: amount,
//     });
//     await wallet.save();

//     const updateUser = await User.findOneAndUpdate(
//       { _id: user_id },
//       { $set: { wallet: new_balance } }
//     );
//     return res.status(200).json({
//       status: 1,
//       message: "wallet updated successfully",
//       wallet_id: wallet_id,
//       user_id: user_id,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// };
function generateTransactionID() {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random base36 string
  return `${timestamp}-${randomString}`;
}

// const addBalance = async (req, res) => {
//   try {
//     let { user_id, amount, transaction_id } = req.body;
//     const user = await User.findOne({ _id: user_id });
//     if (!user) {
//       return res.status(404).json({
//         status: 0,
//         message: "Invalid userID",
//       });
//     }

//     const findWalletDetails = await Wallet.findOne({ user_id: user_id }).sort({
//       _id: -1,
//     });

//     let privious_balance = 0;

//     if (findWalletDetails) {
//       privious_balance = findWalletDetails.new_balance;
//     }
//     let new_balance = 0.0;
//     new_balance = Number(
//       parseFloat(privious_balance) + parseFloat(amount)
//     ).toFixed(2);

//     // console.log(new_balance, typeof new_balance);

//     const wallet_id = generateWalletID(user_id);
//     const wallet = new Wallet({
//       wallet_id: wallet_id,
//       user_id: user_id,
//       remark: "add balance",
//       type: 1,
//       privious_balance: privious_balance,
//       new_balance: new_balance,
//       add_balance: amount,
//     });
//     await wallet.save();
//     const updateUser = await User.findOneAndUpdate(
//       { _id: user_id },
//       { $set: { wallet: new_balance } }
//     );
//     return res.status(200).json({
//       status: 1,
//       message: "wallet updated successfully",
//       wallet_id: wallet_id,
//       user_id: user_id,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// };

function generateWalletID(userID) {
  userID = userID.slice(-4);
  const randomString = crypto.randomBytes(4).toString("hex"); // Generate a random string
  const walletID = `W-${userID}-${randomString}`;
  return walletID;
}

const getWalletBalance = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      return res.status(400).json({
        status: 0,
        message: "user_id is required",
      });
    }
    const findWalletBalance = await User.findOne({ _id: user_id });

    if (!findWalletBalance) {
      return res.status(404).json({
        status: 0,
        message: "user not found",
      });
    }

    const result = await Wallet.aggregate([
      {
        $match: { user_id: user_id },
      },
      {
        $group: {
          _id: null, // Group all matching documents into a single group
          deposited: {
            $sum: {
              $cond: [{ $eq: ["$type", "1"] }, "$add_balance", 0],
            },
          },
          withdraw: {
            $sum: {
              $cond: [{ $eq: ["$type", "2"] }, "$withdraw_balance", 0],
            },
          },
          winnings: {
            $sum: {
              $cond: [{ $eq: ["$type", "3"] }, "$winnings", 0],
            },
          },
        },
      },
    ]);

    let deposited = 0;
    let withdraw = 0;
    let winnings = 0;
    if (result.length > 0) {
      deposited = result[0].deposited;
      withdraw = result[0].withdraw;
      winnings = result[0].winnings;
    }
    return res.status(200).json({
      status: 1,
      totalWalletBalance: findWalletBalance.wallet,
      deposited: deposited,
      withdraw: withdraw,
      winnings: winnings,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
const getTransactionHistory = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    let findTransactionHistory = await Transaction.find({ user_id })
      .sort({ createdAt: -1 })
      .select("-_id transactionId type amount createdAt");

    res.status(200).json({
      status: 1,
      data: findTransactionHistory,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const addBalance = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const user_ip = req.query.user_ip;
    const amount = req.query.amount;
    if (!user_id) {
      return res.status(400).json({
        status: 0,
        message: "userID required",
      });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "Invalid userID",
      });
    }
    const transactionId = generateTransactionID();

    const data = {
      userId: user_id,
      transactionId: transactionId,
      name: user.name,
      email: user.email,
      site: process.env.CLIENT_URL,
      userIp: user_ip,
      mobile: user.phone,
      currency: "CAD",
      language: "en",
      amount: amount,
      type: "CPI",
      sandbox: 1,
    };

    const username = process.env.accessToken; // Replace this with your actual username
    const password = process.env.securityToken; // Replace this with your actual password
    const credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${credentials}`;

    // console.log("data", data);


    //****************************** */

    // Bypassing 
   
    const wallet_id = generateWalletID(user_id);
    const wallet = new Wallet({
      wallet_id: wallet_id,
      user_id: user_id,
      remark: "add balance",
      type: "1",
      privious_balance: 0,
      new_balance: 5000,
      add_balance: 5000,
    });
    await wallet.save();

    const updateUser = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: { wallet: 5000 } }
    );

    //************************************* */

    const response = await axios.post(
      `https://interac.express-connect.com/api/payment-token/${process.env.campaignId}`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
      }
    );

    const paymentUrl = `https://interac.express-connect.com/webflow?transaction=${response.data.data.transactionId}&token=${response.data.token}`;

    const successUrl = "https://buildmy11.com/thankyou.php";
    const failureUrl = "https://buildmy11.com/failed.php";

    const transaction = new Transaction({
      status: "STATUS_INITED",
      user_id: user_id,
      transactionId: transactionId,
      name: user?.name,
      email: user?.email,
      mobile: user.phone,
      amount: amount,
      type: "1",
      remark: "payment initiated",
      user_ip: user_ip,
      currency: "CAD",
    });
    await transaction.save();

    res.status(200).json({
      status: 1,
      transactionID: response?.data?.data?.transactionId,
      paymentUrl: paymentUrl,
      successUrl: successUrl,
      failureUrl: failureUrl,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const withdrawBalance = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const user_ip = req.body.user_ip;
    const amount = req.body.amount;
    const name = req.body.name;
    const fi = req.body.fi;
    const transit = req.body.transit;
    const acct = req.body.acct;
    if (!fi || !transit || !acct) {
      return res.status(400).json({
        status: 0,
        message: "fi, transit and acct are required",
      });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).json({
        status: 0,
        message: "user not found",
      });
    }
    if (user && user?.wallet < parseInt(amount)) {
      return res.status(404).json({
        status: 0,
        message: "Amount is insufficient",
      });
    }
    const transactionId = generateTransactionID();

    const data = {
      userId: user_id,
      transactionId: transactionId,
      name: name || user?.name,
      email: user?.email,
      site: process.env.CLIENT_URL,
      userIp: user_ip,
      currency: "CAD",
      language: "en",
      amount: amount,
      type: "ACH",
      hosted: true,
      fi: fi || "123",
      transit: transit || "12345",
      acct: acct || "52530200002",
      sandbox: true,
    };

    const username = process.env.accessToken; // Replace this with your actual username
    const password = process.env.securityToken; // Replace this with your actual password
    const credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${credentials}`;

    // console.log("data", data);

    const response = await axios.post(
      `${api_collection.gigadat_url}api/payment-token/${process.env.campaignId}`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
      }
    );

    const paymentUrl = `${api_collection.gigadat_url}webflow?transaction=${response?.data?.data?.transactionId}&token=${response?.data?.token}`;

    const successUrl = "https://buildmy11.com/thankyou.php";
    const failureUrl = "https://buildmy11.com/failed.php";

    const transaction = new Transaction({
      status: "STATUS_INITED",
      user_id: user_id,
      transactionId: transactionId,
      name: name || user?.name,
      email: user?.email,
      mobile: user?.phone,
      amount: amount,
      type: "2",
      remark: " ",
      user_ip: user_ip,
      currency: "CAD",
      fi: fi,
      transit: transit,
      acct: acct,
    });
    await transaction.save();

    res.status(200).json({
      status: 1,
      transactionID: response.data.data.transactionId,
      message: paymentUrl,
      successUrl: successUrl,
      failureUrl: failureUrl,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// const gigadatListener1 = async (req, res) => {
//   try {
//     const { status, transaction } = req.query;
//     const { userId, name, email, mobile, amount, type, userIp, currency } =
//       req.body;

//     const checkRes = await CheckRes.create({
//       data: req.query,
//       param1: req.body,
//       param2: req.params,
//     });

//     res.status(200).json({
//       status: 1,
//       message: "Added successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// };

//listener for deposit

const gigadatListener1 = async (req, res) => {
  try {
    const { status, transaction } = req.query;
    const { userId, name, email, mobile, amount, type, userIp, currency } =
      req.body;

    // const checkRes = await CheckRes.create({
    //   data: req.query,
    //   param1: req.body,
    //   param2: req.params,
    // });

    const findWalletDetail = await Wallet.findOne({
      user_id: userId,
    }).sort({
      _id: -1,
    });

    if (status == "STATUS_SUCCESS" && (type == "CPI" || type == "ACK")) {
      let privious_balance = 0;
      if (findWalletDetail) {
        privious_balance = findWalletDetail?.new_balance;
      }
      let new_balance = 0.0;
      new_balance = Number(
        parseFloat(privious_balance) + parseFloat(amount)
      ).toFixed(2);

      const wallet_id = generateWalletID(userId);
      const wallet = new Wallet({
        wallet_id: wallet_id,
        user_id: userId,
        remark: "add balance",
        type: "1",
        privious_balance: privious_balance,
        new_balance: new_balance,
        add_balance: amount,
      });
      await wallet.save();

      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { wallet: new_balance } }
      );

      await Transaction.updateOne(
        { transactionId: transaction },
        {
          $set: {
            status: status,
            payment_type: type,
            user_ip: userIp,
            remark: "added",
            currency: currency,
          },
        }
      );
    } else if (status == "STATUS_SUCCESS" && type == "ACH") {
      let privious_balance = 0.0;

      if (findWalletDetail) {
        privious_balance = findWalletDetail?.new_balance;
      }

      let new_balance = 0.0;
      new_balance = Number(
        parseFloat(privious_balance) - parseFloat(amount)
      ).toFixed(2);

      const wallet_id = generateWalletID(userId);

      const wallet = new Wallet({
        wallet_id: wallet_id,
        user_id: userId,
        remark: "withdraw balance",
        type: "2",
        privious_balance: privious_balance,
        new_balance: new_balance,
        withdraw_balance: amount,
      });
      await wallet.save();

      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { wallet: new_balance } }
      );

      await Transaction.updateOne(
        { transactionId: transaction },
        {
          $set: {
            status: status,
            payment_type: type,
            user_ip: userIp,
            remark: "withdraw",
            currency: currency,
          },
        }
      );
    } else {
      await Transaction.updateOne(
        { transactionId: transaction },
        {
          $set: {
            status: status,
            payment_type: type,
            user_ip: userIp,
            remark: "payment initiated",
            currency: currency,
          },
        }
      );
    }
    res.status(200).json({
      status: 1,
      message: "Added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  addBalance,
  // addBalance1,
  getWalletBalance,
  getTransactionHistory,
  withdrawBalance,
  // withdrawBalance1,
  gigadatListener1,
  checkStatusOfPayment,
};
