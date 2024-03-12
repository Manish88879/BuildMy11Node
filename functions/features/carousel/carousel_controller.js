const { response } = require('express');
const Carousel = require('./carousel_model');
const Corousel = require('./carousel_model');

function generateCarouselID() {
  const timestamp = new Date().getTime(); 
  const random = Math.floor(Math.random() * 10000); 
  const carouselID = `carousel_${timestamp}_${random}`;
  return carouselID;
}

const create = async(req, res) => {
    try {
        const {carousel_name, carousel_path} = req.body;
        const carousel_id = generateCarouselID();
        const create = await Carousel.create({
          carousel_id: carousel_id,
          carousel_name: carousel_name,
          carousel_path: carousel_path,
        });
        res.status(200).json({
            status: 1,
            message: 'added'
        })
        
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message
        })   
    }
}

const getAll = async(req, res) => {
    try {
        const getAllCarousel = await Carousel.find();
        res.status(200).json({
          status: 1,
          data: getAllCarousel,
        });
    } catch (error) {
      res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
}

const check = async(req, res) => {
  res.status(200).json({message: 'running'})
}

module.exports = { getAll, create, check };