const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    match_id: {
      type: String,
    },
    contest_id: {
      type: String,
    },
    team_id: {
      type: String,
    },
    team_point: {
      type: String,
    },
    team_rank: {
      type: String,
    },
    team_actual_rank: {
      type: String,
    },
    winnings_amount: {
      type: String,
    },
    winnings_message: {
      type: String,
    },
    isUp: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const ResultCalculation = mongoose.model('Result', resultSchema);
module.exports = ResultCalculation;

