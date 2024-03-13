const mongoose = require('mongoose');

const CouponTrackSchema = mongoose.Schema({
    // Track -- CouponCode , id , amount , description , date and emalId

    userId : {
        type: String,
        required : true,
        unique: true
    },
    CouponCode: {
        type: String,
        required : true,
        unique: false,
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }


})

const CouponTrack = mongoose.model("CouponTrack" , CouponTrackSchema)
module.exports = CouponTrack;