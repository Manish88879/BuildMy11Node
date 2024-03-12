const mongoose = require("mongoose");
const ContestSchema = mongoose.Schema(
  {
    match_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    user_role: {
      type: String,
      default: "admin",
    },
    contest_id: {
      type: String,
      unique: true,
      // required : true
    },
    contest_name: {
      type: String,
      required: [true, "Please provide Contest Name"],
    },
    contest_size: {
      type: Number,
      required: [true, "Please provide Contest size"],
    },
    entry_fee: {
      type: Number,
      required: [true, "Please provide entreefee"],
    },
    flexible: {
      type: Boolean,
    },
    prize_pool: {
      type: Number,
      required: [true, "Please provide prize_pool"],
    },
    is_private: {
      type: Boolean,
      default: false,
    },
    total_winner: {
      type: Number,
      required: [true, "Please provide total_winner"],
    },
    allow_multiple: {
      type: Boolean,
    },
    size_left: {
      type: Number,
    },
    prize: {
      type: String,
    },
    status: {
      type: String,
      default: "1",
    },
    payment_status: {
      type: String,
      default: "0",
    },
    createdAt: {
      type: Date,
      default: Date.now(), // proper format
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    rank: {
      type: [String],
      required: true,
    },
    prize_pool_percent: {
      type: [String],
      required: true,
    },
    winnings_amount: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Contest = mongoose.model("Contest1", ContestSchema);

module.exports = Contest;
