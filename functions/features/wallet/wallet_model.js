const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    wallet_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
    },
    type: {
      type: String,
      // 1 for credit and 2 for debit
    },
    privious_balance: {
      type: Number,
      default: 0,
    },
    add_balance: {
      type: Number,
      default: 0,
    },
    withdraw_balance: {
      type: Number,
      default: 0,
    },
    new_balance: {
      type: Number,
      default: 0,
    },
    transaction_id: {
      type: String,
    },
    fi: {
      type: String,
    },
    transit: {
      type: String,
    },
    acct: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
