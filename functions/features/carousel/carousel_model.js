const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema(
  {
    carousel_id: {
      type: String,
      required: true,
      unique: true,
    },
    carousel_name: {
      type: String,
    },
    carousel_path: {
      type: String,
    },
  },
  { timestamps: true }
);

const Carousel = mongoose.model("Carousel", CarouselSchema);
module.exports = Carousel;
