const User = require("../user/user_model")
const Wallet = require("../wallet/wallet_model");
const CouponCode = require("./CouponCodeModel");
const crypto = require("crypto");
const CouponTrack = require("./CouponTrackModel");
const CouponTrackController = require

function generateWalletID(userID) {
    userID = userID.slice(-4);
    const randomString = crypto.randomBytes(4).toString("hex"); // Generate a random string
    const walletID = `W-${userID}-${randomString}`;
    return walletID;
  }

const updateCouponWallet = async (userId , amount , remarks , type )  => {
    try{
     const findWalletDetail = await Wallet.findOne({
       user_id: userId,
     }).sort({
       _id: -1,
     });
   
       let privious_balance = 0;
       if (findWalletDetail) {
         privious_balance = findWalletDetail?.new_balance;
       }
       let new_balance = 0.0;
       new_balance = Number(
         parseFloat(privious_balance) + parseFloat(amount)
       ).toFixed(2);
   
       const wallet_id = generateWalletID(userId);
       const wallet = new Wallet({
         wallet_id: wallet_id,
         user_id: userId,
         remark: remarks,
         type: type,
         privious_balance: privious_balance,
         new_balance: new_balance,
         add_balance: amount,
       });
       await wallet.save();
   
       const updateUser = await User.findOneAndUpdate(
         { _id: userId },
         { $set: { wallet: new_balance } }
       );
    }catch(e){
     console.log(e);
    }
     
   }

const create = async (req , res ) => {
    try{
    const {couponCode , amount , description } = req.body;
    if (!couponCode || !amount ){
        return res.json({
            status: 0,
            message : "Coupon code , amount and description are required."
        });
    }
    // Find Referral Code 
    const findCouponCode = await CouponCode.findOne({couponCode: couponCode});
    if (findCouponCode)
      return res.json({
        status: 0,
        message: "Coupon code already exists.",
      });


    const coupon = await CouponCode.create({
        couponCode: couponCode,
        amount: amount,
        description: description
    })
    return res.json({
        status: 1,
        message : 'Coupon Created Successfully',
      });
    }catch (error){
        return res.status(500).json({
            status: 0,
            message: "Something went wrong!",
          });
    }
}



const useCoupon = async (req , res ) => {
    try{
        const {id , couponCode} = req.body;
        if(!id || !couponCode){
            return res.status(200).json({
                status: 0,
                message: "Please Enter Coupon Code"
            });
        } 
        CouponTrack.createTrackCoupon
        // Validate User ID
        const isValidUserId = await User.findOne({_id : id});
        // Validate Coupon code 
        if(isValidUserId){
        const isValidCouponcode = await CouponCode.findOne({couponCode : couponCode})
        console.log("0000"  , isValidCouponcode)
        if(!isValidCouponcode){
            return res.json({
                status: 0,
                message: "Invalid Coupon code"
            });
        }
        let couponAmount = 0;
        // Add Wallet amount
        let findCouponCode = await CouponCode.findOne({couponCode : couponCode});
        couponAmount = findCouponCode?.amount;
        updateCouponWallet( String(id ?? '') , couponAmount , "CouponMoney" , 6)

        console.log("ID: " , id , " couponCode: " , couponCode , "amount: " , couponAmount , "description: " , findCouponCode?.description , "email : " , isValidUserId?.email )
        const coupon = await CouponTrack.create({
          userId: id,
          CouponCode: couponCode,
          amount : couponAmount,
          description :findCouponCode?.description,
          email:isValidUserId?.email,
        })

        return res.json({
            status: 1,
            message : `Congratulations! ${couponAmount} has been added to your wallet`,
          });
        }
        return res.json({
            status: 0,
            message: "I don't know you"
        })
    }catch(error){
        return res.status(500).json({
            status : 0,
            message: "Something went wrong!"
        });
    }
}

module.exports = {
    create,
    useCoupon
}