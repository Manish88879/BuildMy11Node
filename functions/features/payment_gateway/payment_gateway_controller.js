const axios = require("axios");
const btoa = require("btoa");
const fs = require("fs");
const User = require("../user/user_model");
const Transaction = require("./../wallet/transaction_model");

const getPaymentToken = async (req, res) => {
  try {
    let {
      userId,
      transactionId,
      name,
      email,
      site,
      userIp,
      mobile,
      currency,
      language,
      amount,
      type,
      sandbox,
    } = req.body;

    transactionId = generateTransactionID();

    const data = {
      userId: userId,
      transactionId: transactionId,
      name: name,
      email: email,
      site: site,
      userIp: userIp,
      mobile: mobile,
      currency: currency,
      language: language,
      amount: amount,
      type: type,
      sandbox: sandbox,
    };
    const username = process.env.accessToken; // Replace this with your actual username
    const password = process.env.securityToken; // Replace this with your actual password
    const credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${credentials}`;

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
    //   const response1 = await response.json();
    // console.log("Response", response);

    if (response.data) {
      return res.json({
        status: true,
        message: "success",
        data: response.data,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};
function generateTransactionID() {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random base36 string
  return `${timestamp}-${randomString}`;
}

const getPaymentTokenKyc = async (req, res) => {
  try {
    let {
      userId,
      first_name,
      last_name,
      email,
      DOB,
      YOB,
      mobile,
      site,
      userIp,
      type,
      sandbox,
      address,
      unit,
      postal_code,
      province,
      language,
      city,
      country_code,
      amount,
      currency,
      name,
      transit,
      fi,
      acct,
    } = req.body;

    const data = {
      userId: userId,
      first_name: first_name,
      last_name: last_name,
      email: email,
      DOB: DOB,
      YOB: YOB,
      mobile: mobile,
      site: site,
      userIp: userIp,
      type: type,
      sandbox: sandbox,
      address: address,
      unit: unit,
      postal_code: postal_code,
      province: province,
      language: language,
      city: city,
      country_code: country_code,
      amount: amount,
      currency: currency,
      name: name,
      transit: transit,
      fi: fi,
      acct: acct,
    };

    const username = process.env.accessToken;
    const password = process.env.securityToken;

    const credentials = btoa(`${username}:${password}`);
    const authHeader = `basic ${credentials}`;
    const response = await axios.post(
      `https://interac.express-connect.com/api/payment-token/${campaignId}`,
      data,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
      }
    );
    console.log("response", response);
    if (response.data) {
      return res.json({
        status: true,
        message: "success",
        data: response.data,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

const checkTransactionStatus = async (req, res) => {
  try {
    const  id  = req.query.id;
    // console.log(id);
    const username = process.env.accessToken;
    const password = process.env.securityToken;
    const credentials = btoa(`${username}:${password}`);
    const authHeader = `basic ${credentials}`;

    const response = await axios.get(
      `https://interac.express-connect.com/api/transactions/${id}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    // console.log('response', response);
    if (response.data) {
      return res.json({
        status: response.data.status,
        id: response.data.id,
        data: response.data.data,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

const paymentListner = async (req, res) => {
  try {
    const requestBody = JSON.stringify(req.body, null, 2);
    // console.log("requestBody", requestBody);
    fs.writeFile("functions/fileData.txt", requestBody, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.status(500).send({ erorr: err.message });
      } else {
        console.log("Data written to file successfully");
        res.status(200).send("Data written to file successfully");
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const readFileData = async (req, res) => {
  fs.readFile("functions/fileData.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    console.log("File contents:", data);
    res.status(200).send(data);
  });
};

const transactionDetails = async (req, res) => {
  try {
    // const { user_id, amount } = req.body;
    const user_id = req.query.user_id;
    const amount = req.query.amount;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.json({
        status: 0,
        message: "user not found or please check user id",
      });
    }

    const transactionId = generateTransactionID();

    const data = {
      userId: user_id,
      transactionId: transactionId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      currency: "CAD",
      language: "en",
      amount: amount,
      type: "CPI",
      sandbox: 1,
    };

    const username = process.env.accessToken;
    const password = process.env.securityToken;
    const credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${credentials}`;

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
    // console.log('response data', response.data.data);
    const transaction = new Transaction({
      user_id: response.data.data.userId,
      txn_id: response.data.data.transactionId,
      amount: response.data.data.amount,
      name: user.name,
      email: user.email,
      phone: user.phone,
      type: response.data.data.type,
      created: time(),
    });
    await transaction.save();
    if (response.data) {
      return res.json({
        status: true,
        message: "success",
        paymentUrl: paymentUrl,
      });
    }
  } catch (error) {
    return res.json({
      status: 0,
      message: error.message,
    });
  }
};

function time() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}

module.exports = {
  getPaymentToken,
  getPaymentTokenKyc,
  checkTransactionStatus,
  paymentListner,
  readFileData,
  transactionDetails,
};
