const express = require("express");
const router = express.Router();
const upload = require("./../../middlewares/multer");
const userController = require("./user_controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/userDetails", userController.userDetails);
// router.post("/socialRegister", userController.socialRegister);
router.patch(
  "/updateProfilePic",
  upload.single("img"),
  userController.updateProfilePic
);
router.post("/forgotPassword", userController.forgetPassword);
router.post("/resetPassword", userController.resetPassword);
router.post("/logout", userController.logout);
router.patch(
  "/updateUserDetails/:id",
  upload.single("profile_pic"),
  userController.updateUserDetails
);

router.post("/socialSignup", userController.socialSignup);
router.post("/socialSignin", userController.socialSignin);
router.get("/getNotificationDetail/:id", userController.getNotificationDetail);

router.post("/addAccountInfo", userController.addAccountInfo);

router.get("/getAccountInfo", userController.getAccountInfo);
router.delete("/softdeleteAccountInfo/:id", userController.softdeleteAccountInfo);

module.exports = router;
