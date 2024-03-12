const express = require('express');
const router = express.Router();

const contestController = require('./contest_controller')
router.post("/prizePoolTable", contestController.prizePoolTable);
router.post('/contestCreate', contestController.contestCreate);
router.post('/contestListAdmin', contestController.contestListAdmin);
router.post("/contestDetails", contestController.contestDetails);
router.post("/myContestList", contestController.myContestList);



module.exports = router;