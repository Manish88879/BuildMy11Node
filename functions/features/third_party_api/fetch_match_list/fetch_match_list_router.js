const express = require('express');
const router = express.Router();
const matchList = require('./fetch_match_list_controller')
router.get('/matchList', matchList.matchList);


module.exports = router;