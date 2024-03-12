const express = require("express");
const router = express.Router();
const matchList = require("./match_list_controller");
router.get("/getMatchList", matchList.getMatchList);
router.post("/myMatchList", matchList.myMatchList);
router.get("/findMatchDetailWithMatchIdAndCID", matchList.findMatchDetailWithMatchIdAndCID);


module.exports = router;
