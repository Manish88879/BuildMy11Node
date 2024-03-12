const express = require('express');
const router = express.Router();

const joinContestController = require('./join_contest_controller');

router.post('/createJoinContest', joinContestController.createJoinContest);


module.exports = router;