const express = require("express");
const controller = require("../../../controllers/weather");

const router = express.Router();

router.route("/:location_id").get(controller.getWeatherByLocationId);

module.exports = router;
