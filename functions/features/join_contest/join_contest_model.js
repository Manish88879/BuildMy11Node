const mongoose = require("mongoose");
const ContestSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  match_id: {
    type: String,
    required: true,
  },
  contest_id: {
    type: String,
    required: true,
  },
  team_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
}, {timestamp: true});

const JoinedContest = mongoose.model("JoinContest", ContestSchema);

module.exports = JoinedContest;
