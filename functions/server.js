//imports
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const path = require("path");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
//const admin = require("firebase-admin");
const commonPath = `/.netlify/functions/server`;
//mongoose
const connectToMongoDB = require("./config/mongoose")
//app config
const app = express();
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(path.join(__dirname, "/uploads"), express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//User Api

app.get('/' , (req , res) => {
  res.send('App is running');
})
app.use(`${commonPath}/users`, require("./features/user/user_router"));

// payment gateway Api
app.use(
  `${commonPath}/paymentGateway`,
  require("./features/payment_gateway/payment_gateway_router")
);

//third party Api
app.use(
  `${commonPath}/thirdPartyApi`,
  require("./features/third_party_api/fetch_match_list/fetch_match_list_router")
);

//match list
app.use(`${commonPath}/match`, require("./features/match/match_list_router"));

// contest
app.use(`${commonPath}/contest`, require("./features/contest/contest_router"));

// player
app.use(
  `${commonPath}/player`,
  require("./features/player/player_list_router")
);

// Team
app.use(`${commonPath}/team`, require("./features/team/team_router"));

// Wallet
app.use(`${commonPath}/wallet`, require("./features/wallet/wallet_router"));

//join contest
app.use(
  `${commonPath}/joinContest`,
  require("./features/join_contest/join_contest_router")
);

//fantasy point api
app.use(
  `${commonPath}/fantasyPoint`,
  require("./features/fantasy_point/fantasy_point_router")
);

//commentry api
app.use(
  `${commonPath}/commentary`,
  require("./features/commentary/commentary_router")
);

//scorecard api
app.use(
  `${commonPath}/scorecard`,
  require("./features/scorecard.js/scorecard_router")
);

app.use(
  `${commonPath}/commonApi`,
  require("./features/common_api/common_api_router")
);

//result calculation
app.use(
  `${commonPath}/resultCalculation`,
  require("./features/result_calculation/result_calculation_router")
);

//carousel
app.use(
  `${commonPath}/carousel`,
  require("./features/carousel/carousel_router")
);

//fcm
app.use(
  `${commonPath}/fcm`,
  require("./features/fcm/fcm_router")
);

app.use((req, res) => {
  res.status(404).send("API not found, please check your path");
});

// Db Connection
// const connection_url = process.env.MONGODB_CONNECTION_URL;



app.listen(port, () => {
  console.log(`Listening to port ${port}`);
  connectToMongoDB();
});

exports.handler = serverless(app);
