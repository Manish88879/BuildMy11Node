const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "userName",
    },
    user_name: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v.length === 10;
        },
        message: (props) => `${props.value} is not a valid mobile number1!`,
      },
      // set: function (v) {
      //   if (/^[6-9]/.test(v)) {
      //     return v;
      //   } else {
      //     throw new Error(`${v} is not a valid mobile number2!`);
      //   }
      // },
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      default: "http://buildmy11.com/playerimage/default.png",
    },
    team_name: {
      type: String,
      default: "User123",
    },
    status: {
      type: Boolean,
    },
    referralCode: {
      type: String,
      unique: true
    },
    referredByCode: {
      type: String,
      default: '0'
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user", "social_user"],
    },
    wallet: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    fcm_token: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    //User’s financial institution number
    fi: {
      type: String,
    },
    //User’s account transit number
    transit: {
      type: String,
    },
    //User’s account number
    acct: {
      type: String,
    },
    social_token: {
      type: String,
      default : '0'
    },
    type: {
      type: String,
      default: "normal",
    },
  },
  { timeStamp: true }
);


const User = mongoose.model("User1", userSchema);

module.exports = User;
