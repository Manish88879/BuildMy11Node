const { default: mongoose } = require("mongoose");

const userAccountSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    fi: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 3 && v.length <= 4;
        },
        message: "fi must be between 3 and 4 characters long",
      },
    },
    //User’s account transit number
    transit: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 5;
        },
        message: "transit must be exactly 5 characters long",
      },
    },
    //User’s account number
    acct: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 7 && v.length <= 12;
        },
        message: "acct must be between 7 and 12 characters long",
      },
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const UserAccount = mongoose.model("UserAccount", userAccountSchema);
module.exports = UserAccount;