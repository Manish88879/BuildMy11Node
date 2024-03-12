const mongoose = require("mongoose");

const fcmNotificationSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    fcm_token: String,
    title: String,
    body: String,
}, {timestamps: true});

const Notification = mongoose.model("Notification", fcmNotificationSchema);
module.exports = Notification;