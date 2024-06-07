const express = require("express");
const controller = require("../../../controllers/history");

const router = express.Router();

 router.route("/").get(controller.getPastWeatherData);

module.exports = router;
