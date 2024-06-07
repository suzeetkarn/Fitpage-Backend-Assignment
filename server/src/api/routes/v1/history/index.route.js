const express = require("express");
const controller = require("../../../controllers/history");

const router = express.Router();

router.route("/:location_id").get(controller.getPastWeatherData);

module.exports = router;
