const mongoose = require("mongoose");
const TransactionsSchema = mongoose.Schema(
  {
    status: {
      type: String,
    },
    user_id: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "User Name",
    },
    email: {
      type: String,
      default: "example@example.com",
    },
    mobile: {
      type: String,
    },
    amount: {
      type: Number,
    },
    type: {
      type: String,
    },
    payment_type: {
      type: String,
    },
    remark: {
      type: String,
      // default: "",
    },
    user_ip: {
      type: String,
    },
    currency: {
      type: String,
    },
    createdAt: {
      type: String,
      default: new Date(),
    },
  },
  { timestamps: true }
);

// Middleware to set the createdAt field before saving
TransactionsSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

const Transactions = mongoose.model("Transactions", TransactionsSchema);

module.exports = Transactions;
