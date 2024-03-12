const mongoose = require('mongoose');
const CommentarySchema = mongoose.Schema(
  {
    match_id: String,
    inning1_commentary: {
      Type: [Object],
    },
    inning2_commentary: {
      Type: [Object],
    },
  },
  { timestamps: true }
);

const Commentary = mongoose.model("Commentary", CommentarySchema);

module.exports = Commentary;