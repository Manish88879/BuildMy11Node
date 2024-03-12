const express = require("express");
const router = express.Router();
const payGwController = require("./payment_gateway_controller");

router.post("/getPaymentToken", payGwController.getPaymentToken);

router.post("/getPaymentTokenKyc", payGwController.getPaymentTokenKyc);

router.get("/checkTransactionStatus", payGwController.checkTransactionStatus);

router.get("/transactionDetails", payGwController.transactionDetails);

router.post("/paymentListner", payGwController.paymentListner);

router.get("readFileData", payGwController.readFileData);

module.exports = router;

