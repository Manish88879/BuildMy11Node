const FCM = require("fcm-node");
const serverKey = process.env.FCM_KEY;
const User = require("./../features/user/user_model")
const Notification = require("./../features/user/fcm_notification_model");
const fcm = new FCM(serverKey);

// const registrationToken =
  // "ejrEMyIAS9eLWl6VQiMuFc:APA91bG9vNqBuQcfTGz80L_CgWAIXUIaaM_f1Di3Xf_YVYym2VJYIIigpgY0YVjcXQc-E7pchnIUlSkwN57rTUoC_C_yz_pRk6dHA3qRukXCKHVgyZMTOQlh5PE8UGVC5HHEHN8BGeWM";
const sendFCMNotification = async (user_id, title, body) => {
  const user = await User.findOne({ _id: user_id });
  const registrationToken = user?.fcm_token;
  // Notification payload
  const message = {
    to: registrationToken,
    notification: {
      title,
      body,
    },
  };
  // Send the notification
  fcm.send(message, async function (err, response) {
    if (err) {
      console.error("Error sending notification:", err);
      //  console.log();
      if (
        err.results &&
        err.results[0] &&
        err.results[0].error === "NotRegistered"
      ) {
        console.log(`Removing invalid token: ${registrationToken}`);
        // Remove the invalid token from your database or storage
      }
    } else {
      console.log("Successfully sent notification:", response);
      const notification = new Notification({
        user_id: user_id,
        fcm_token: registrationToken,
        title: title,
        body: body,
      });
      await notification.save();
    }
  });
};

module.exports = sendFCMNotification;
