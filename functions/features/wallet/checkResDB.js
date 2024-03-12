const mongoose = require("mongoose");
const CheckResSchema = mongoose.Schema(
  {
    data: {
      type: Array,
    },
    param1: {
      type: Array,
    },
    param2: {
      type: Array,
    },
    createdAt: {
      type: String,
    },
  },
  { timestamps: true }
);

const CheckRes1 = mongoose.model("CheckRes1", CheckResSchema);

module.exports = CheckRes1;
