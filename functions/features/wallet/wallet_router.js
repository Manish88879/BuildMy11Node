const express = require('express');
const router = express.Router();

const walletController = require('./wallet_controller');

// router.post('/addBalance', walletController.addBalance);
router.get("/addBalance", walletController.addBalance);

// router.post("/withdrawBalance", walletController.withdrawBalance);
router.post("/withdrawBalance", walletController.withdrawBalance);

router.get('/getWalletBalance', walletController.getWalletBalance);
router.get("/getTransactionHistory", walletController.getTransactionHistory);

router.post("/gigadatListener", walletController.gigadatListener1);

router.get('/getStatusOfPayment', walletController.checkStatusOfPayment);


module.exports = router;