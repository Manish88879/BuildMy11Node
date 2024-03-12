const express = require("express");
const router = express.Router();

const carouselController = require("./carousel_controller");
router.post("/create", carouselController.create);
router.get("/getAll", carouselController.getAll);
router.get("/home", carouselController.check);



module.exports = router;
