const User = require("../user/user_model")
const Wallet = require("../wallet/wallet_model");
const CouponCode = require("./CouponCodeModel");
const crypto = require("crypto");
const CouponTrack = require("./CouponTrack/CouponTrackModel");

const createTrackCoupon = async (req , res ) => {
    try{
    const {userId , couponCode , amount , description , email } = req.body;
    if (!couponCode || !amount || !userId || !description || !email){
        return res.json({
            status: 0,
            message : "Coupon code , amount and description are required , email , userId are required !!"
        });
    }

    const coupon = await CouponTrack.create({
      userId: userId,
      CouponCode: couponCode,
      amount : amount,
      description : description,
      email: email
    })
    
    }catch (error){
        return res.status(500).json({
            status: 0,
            message: "Something went wrong!",
          });
    }
}

module.exports = {
    createTrackCoupon
}