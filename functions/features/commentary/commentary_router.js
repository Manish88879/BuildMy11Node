const express = require("express");
const router = express.Router();

const commentryController = require("./commentary_controller");

router.get("/fetchCommentry", commentryController.fetchCommentaryApi);
router.get("/getCommentaries", commentryController.getCommentaries);

// const scorecardController = require('./scorecard')
// router.get("/getScorecard", scorecardController.scorecard);

module.exports = router;
