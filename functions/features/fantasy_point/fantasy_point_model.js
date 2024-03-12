const mongoose = require("mongoose");
const FantasyPointSchema = mongoose.Schema(
  {
    match_id: String,
    cid: String,
    pid: String,
    name: String,
    role: String,
    rating: Number,
    point: Number,
    starting11: Number,
    run: Number,
    four: Number,
    six: Number,
    sr: Number,
    fifty: Number,
    duck: Number,
    wkts: Number,
    maidenover: Number,
    er: Number,
    catch: Number,
    runoutstumping: Number,
    runoutthrower: Number,
    runoutcatcher: Number,
    directrunout: Number,
    stumping: Number,
    thirty: Number,
    bonus: Number,
    bonuscatch: Number,
    bonusbowedlbw: Number,

  },
  { timestamps: true }
);

const FantasyPoint = mongoose.model("FantasyPoint", FantasyPointSchema);

module.exports = FantasyPoint;
