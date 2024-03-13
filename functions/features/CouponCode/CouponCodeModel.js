// Track -- CouponCode , id , amount , description , date and emalId

const mongoose = require("mongoose");

const CouponCodeSchema = mongoose.Schema(
    {
        couponCode: {
            type: String,
            required: true,
            unique: true
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        status: {
            type: Number,
            required: true,
            description: '1 - Created , 2 - Used',
            default: 1
        },
        createdAt: {
            type: Date,
            default: Date.now,
          },
    }
)

const CouponCode = mongoose.model("CouponCode", CouponCodeSchema);

module.exports = CouponCode;