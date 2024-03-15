const User = require("./user_model");
const Wallet = require("../wallet/wallet_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const sendEmail = require("./../../middlewares/nodemailer");
const base64Img = require("base64-img");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const sendFCMNotification = require("./../../middlewares/fcm_notification");
const Notification = require("./fcm_notification_model");
const UserAccount = require("./user_account_model");

function generateUsername(email) {
  const username = email.split("@")[0];
  return username;
}

function generateReferralCode(email) {

  // Generate random uppercase letters
  const randomLetters = Array.from({ length: 8 }, () => {
      return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }).join('');

  // Create referral code
  const referralCode = email.substring(0, 4).toUpperCase() + randomLetters;

  return referralCode;
}

function generateWalletID(userID) {
  userID = userID.slice(-4);
  const randomString = crypto.randomBytes(4).toString("hex"); // Generate a random string
  const walletID = `W-${userID}-${randomString}`;
  return walletID;
}

const updateReferredWallet = async (userId , amount , remarks , type )  => {
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

const register = async (req, res) => {
  let referralByUser = "";
  try {
    const { name, phone, email, password , referredByCode } = req.body;
    if (!phone || !email || !password)
      return res.json({
        status: 0,
        message: "phone, email and password are required",
      });
    const findUserByPhone = await User.findOne({ phone: phone });
    if (findUserByPhone)
      return res.json({
        status: 0,
        message: "Phone no is already registered",
      });
    const findUserByEmail = await User.findOne({ email: email });
    if (findUserByEmail)
      return res.json({
        status: 0,
        message: "Email is already registered",
      });

      if(referredByCode == ""){
        referredByCode == 0 ;
      }
      else{
        
        let findUserByReferralCode = await User.findOne({ referralCode : referredByCode });
        if (!findUserByReferralCode)
          return res.json({
            status: 0,
            message: "Please Enter Valid Referral code",
          });
          else{
            referralByUser  =  findUserByReferralCode?._id
          }
      }

     
    let encryptedPassword = await bcrypt.hash(password, 10);
    let profile_pic = "https://buildmy11.com/playerimage/default.png";
    const lowercaseEmail = email.toLowerCase();
    const user_name = generateUsername(email);
    const user_referral = generateReferralCode(email);
    const user = await User.create({
      name: name,
      user_name: user_name || " ",
      phone: phone,
      email: lowercaseEmail,
      password: encryptedPassword,
      role: "user",
      profile_pic: profile_pic,
      referralCode: user_referral,
      referredByCode: referredByCode
    });
    // const findUser = await User.findOne({ email: lowercaseEmail });

//******************* 

 if(referredByCode != 0){
  updateReferredWallet( String(user?.id ?? '') , process.env.REFERRAL_POINTS , "Referred" , 4)
  updateReferredWallet( String(referralByUser?? '') , process.env.REFERRED_PONITS , "Referral" , 5)
 }

//************* */


    return res.json({
      status: 1,
      User_id: user?._id,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // const { phone, email, password } = req.body;
    // console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({
        status: 0,
        message: "Invalid credentials",
      });
    }

    let user;
    user = await User.findOne({ phone: username });
    if (!user) {
      user = await User.findOne({ email: username });
    }
    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "sign up before login",
      });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    // console.log(user);
    if (!comparedPassword) {
      return res.json({
        status: 0,
        message: "wrong password",
      });
    }

    const token = jwt.sign(
      { userID: user._id, phone: user.phone, email: user.email },
      process.env.TOKEN_KEY,
      { expiresIn: "15d" }
    );
    // sendFCMNotification(user?._id, "Login", "successfully logged");

    return res.json({
      status: 1,
      message: "success",
      token: token,
    });
  } catch (error) {
    return res.json({
      status: 0,
      message: error.message,
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const id = req.body.id;
    const token = req.body.token || " ";
    if (!id) {
      return res.status(404).json({
        status: 0,
        message: "User ID required",
      });
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res
        .status(400)
        .json({ status: 0, message: "User not found, Please check userID" });
    }

    user.fcm_token = token;
    await user.save();

    let arr = [];
    arr.push({
      id: user?._id,
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      wallet: user?.wallet,
      profile_pic: user?.profile_pic,
      team_name: user?.team_name,
      fcm_token: user?.fcm_token,
    });
    sendFCMNotification(user?._id, "Welcome", "Welcome in buildMY11");

    return res.status(200).json({
      status: 1,
      message: "success",
      data: arr,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const id = req.body.id;
    const imgPath = req.file.filename;
    if (!id)
      return res.json({
        status: 0,
        message: "Please enter a valid id of user",
      });
    if (!imgPath)
      return res.json({
        status: 0,
        message: "Please upload a new image",
      });

    const user = await User.findById({ _id: id });
    if (user) {
      const result = await User.updateOne(
        { _id: id },
        { profile_pic: imgPath }
      );
      if (result.acknowledged) {
        return res.json({
          status: 1,
          message: "successfully",
        });
      }
    } else
      return res.json({
        status: 0,
        message: "Please enter a valid id",
      });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const user_id = req?.params?.id;
    const { user_name, team_name } = req?.body;

    let profile_pic = "";
    if (req?.file) {
      // if (req?.file?.size > 630824) {
      //   return res.status(400).json({
      //     status: 0,
      //     message: "Please upload small size of profile_pic",
      //   });
      // }
      const image_path = req.file.path;
      profile_pic = await convertToBase64(image_path);
    }

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(400).json({
        status: 0,
        message: "User not found, check your id",
      });
    }

    if (user_name) user.name = user_name;
    if (team_name) user.team_name = team_name;
    if (profile_pic) user.profile_pic = profile_pic;

    await user.save();

    const Data = {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      wallet: user?.wallet,
      profile_pic: user?.profile_pic,
      team_name: user?.team_name,
      fcm_token: user?.fcm_token,
    };

    res.status(200).json({
      status: 1,
      message: "updated successfully",
      data: Data,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const convertToBase64 = async (imagePath) => {
  try {
    // Resize and compress the image using jimp
    const image = await Jimp.read(imagePath);
    await image.resize(300, Jimp.AUTO); // Adjust the width as needed
    const compressedImageBase64 = await image
      .quality(80)
      .getBase64Async(Jimp.MIME_JPEG);

    return compressedImageBase64;
  } catch (error) {
    throw new Error("Error converting image to base64: " + error.message);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send reset password email
    // var smtpConfig = {
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true, // use SSL
    //   auth: {
    //     user: "kanhaiya@aetherss.com",
    //     pass: "flqkuphcswxjcykt",
    //   },
    // };
    // const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: "kanhaiya@aetherss.com",
      to: user.email,
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${process.env.CLIENT_URL}/dashboard/pages/reset_password.php?token=${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      // html: `<p><a href="https://www.buildmy11.com/reset-password?token=${resetToken}">Click here</a> to reset your password.</p>`,
      //dashboard/pages/reset_password.php?token=123456789
    };
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //     return res.status(500).json({ message: "Failed to send reset email." });
    //   }
    //   console.log("Email sent:", info.response);
    //   res.status(200).json({
    //     status: 1,
    //     message: "Password reset instructions sent to your email.",
    //   });
    // });
    sendEmail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send reset email." });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({
        status: 1,
        message: "Password reset instructions sent to your email.",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
// Reset password route
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
    });

    if (!user) {
      return res.status(400).json({
        status: 0,
        message: "Password reset token is invalid or has expired.",
      });
    }

    let encryptedPassword = await bcrypt.hash(newPassword, 10);

    // Set the new password and clear the reset token
    user.password = encryptedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ status: 1, message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

const logout = async (req, res) => {
  try {
    console.log(req.header("Authorization"));
    // Assuming you have the user's token in a cookie or request header
    const token = req.header("Authorization") || req.cookies.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({
        status: 0,
        message: "Token not found. You are not logged in.",
      });
    }

    // Invalidate the token (e.g., by blacklisting it on the server)
    // Depending on your implementation, you may have a blacklist or a mechanism to revoke tokens

    // Respond with a successful logout message
    const clearCookie = await res.clearCookie("token"); // Clear the token cookie if you're using cookies
    res.status(200).json({
      status: 1,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const socialSignup = async (req, res) => {
  let referralByUser = "";
  try {
    const { token, name, email, phone, password, profile_pic, type , referredByCode  } = req.body;
    const findPhone = await User.findOne({ phone: phone });
    if (findPhone) {
      return res.status(400).json({
        status: 0,
        message: "phone already used",
      });
    }
    const findEmail = await User.findOne({ email: email });
    if (findEmail) {
      return res.status(400).json({
        status: 0,
        message: "email already used",
      });
    }

    if (!token && !email && !phone) {
      return res.status(400).json({
        status: 0,
        message: "token, email and phone are required",
      });
    }

    if(referredByCode == ""){
      referredByCode == 0 ;
    }
    else{
        
      let findUserByReferralCode = await User.findOne({ referralCode : referredByCode });
      if (!findUserByReferralCode)
        return res.json({
          status: 0,
          message: "Please Enter Valid Referral code",
        });
        else{
          referralByUser  =  findUserByReferralCode?._id
        }
    }

    const user_name = generateUsername(email);
    const user_referral = generateReferralCode(email);

    const socialUser = new User({
      social_token: token,
      name: name,
      email: email,
      phone: phone,
      password:
        password ||
        "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
      user_name: user_name,
      profile_pic: profile_pic,
      type: type || "social",
      referralCode: user_referral,
      referredByCode: referredByCode
    });

    

    await socialUser.save();
    // console.log("socialUser", socialUser);
    if(referredByCode != 0){
      updateReferredWallet( String(socialUser?.id ?? '') , process.env.REFERRAL_POINTS , "Referred" , 4)
      updateReferredWallet( String(referralByUser?? '') , process.env.REFERRED_PONITS , "Referral" , 5)
     }
    


    res.status(200).json({
      status: 1,
      id: socialUser?._id,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
const socialSignin = async (req, res) => {
  try {
    token = req.body.token;
    const user = await User.findOne({ social_token: token });
    console.log("user -= " , user)
    if (user?.email ||  user?.phone) {
      return res.status(200).json({
        status: 1,
        id: user?._id,
      });
    }
    res.status(400).json({
      status: 0,
      message: "user details not found",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const getNotificationDetail = async (req, res) => {
  try {
    const user_id = req.params.id;
    console.log(user_id);
    let notification;
    if (user_id) {
      notification = await Notification.find({ user_id }).limit(50);
    } else {
      notification = await Notification.find().limit(50);
    }
    res.status(200).json({
      status: 1,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const addAccountInfo = async (req, res) => {
  try {
    const { name, user_id, fi, transit, acct } = req.body;
    if (!name || !user_id || !fi || !transit || !acct) {
      return res.status(404).json({
        status: 0,
        message: "name, user_id, fi, transit and acct are required",
      });
    }
    const findUserAcct = await UserAccount.findOne({name, user_id, fi, })

    const userAccount = new UserAccount({
      name: name,
      user_id: user_id,
      fi: fi,
      transit: transit,
      acct: acct,
    });
    await userAccount.save();
    res.status(200).json({
      status: 1,
      message: "success",
    });
  } catch (error) {
    //error?.errors?.fi?.properties?.message  , transit:
    // console.log(error?.errors);
    // if (error?.errors) {
    //   return res.status(500).json({
    //     status: 0,
    //     message:
    //       error?.errors?.fi?.properties?.message ||
    //       error?.errors?.transit?.properties?.message ||
    //       error?.errors?.acct?.properties?.message ||
    //       "internal server error",
    //   });
    // }
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
const getAccountInfo = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const getAccountInfo = await UserAccount.find({ user_id: user_id, status: 1 });
    res.status(200).json({
      status: 1,
      data: getAccountInfo,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};


const softdeleteAccountInfo = async(req, res) => {
  try {
    const acctInfoId = req.params.id;
    // const deleteAccountInfo = await UserAccount.deleteOne({_id: acctInfoId});
    const softDelete = await UserAccount.updateOne(
      {_id: acctInfoId},
      {$set: {
        status: 0,
      }}
    )
    res.status(200).json({
      status: 1,
      message: "Deleted successfully"
    }) 
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "internal server error",
    }) 
  }
}

const getRefrralDetail = async(req , res ) => {
  try{
    const userId = req.query.user_id;
    console.log("userId : " , userId)
    const isValidUserId = await User.findOne({_id: userId});

    console.log("Ref : " , isValidUserId)

    if(!isValidUserId){
      return res.status(200).json({
        status: 0,
        message :  'Sorry! I can\'t find you ' 
      })
    }
    console.log("Ref : " , isValidUserId)
    res.status(200).json({
      status: 1,
      myreferralCode: isValidUserId?.referralCode,
      referredByCode: isValidUserId?.referredByCode,
      rewardUpto: process.env.REWARDUPTO,
      messageToShare: `🚀 Exciting News! 🚀

      Join the fun on our Build my 11  and unlock exclusive rewards worth up to ${process.env.REWARDUPTO}! 🎉✨
      
      📲 Simply download our app from the Play Store using the link below:
      https://play.google.com/store/apps?hl=en_IN&gl=US
      
      🔑 Don't forget to use our referral code ${isValidUserId?.referralCode} during sign-up to claim your bonus! 💰💸
      
      Play , win and share the love! 🌟 #EarnWithUs #ExclusiveRewards`
    })
  }catch(error){
    return res.status(500).json({
      status: 0,
      message: "Something went wrong!"
    })
  }
};

module.exports = {
  register,
  login,
  userDetails,
  updateProfilePic,
  forgetPassword,
  resetPassword,
  logout,
  updateUserDetails,
  socialSignup,
  socialSignin,
  getNotificationDetail,
  addAccountInfo,
  getAccountInfo,
  softdeleteAccountInfo,
  getRefrralDetail
};
