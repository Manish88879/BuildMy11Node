const express = require("express");
const router = express.Router();

const couponCodeController = require('./CouponCodeController');

router.post('/create' , couponCodeController.create);

router.post('/useCoupon' , couponCodeController.useCoupon);

module.exports = router;