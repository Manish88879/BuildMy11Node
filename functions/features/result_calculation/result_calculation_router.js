const express = require('express');
const router = express.Router();

const resultCalculation = require("./result_calculation_controller");
router.get("/createResult", resultCalculation.resultCalculate)

module.exports = router;