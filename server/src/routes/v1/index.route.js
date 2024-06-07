const express = require("express");
const controller = require("../../api/controllers");

const router = express.Router();

router
  .route("/locations")
  .get(controller.getAllLocations)
  .post(controller.addLocation);

router
  .route("/locations/:location_id")
  .get(controller.getLocationById)
  .put(controller.updateLocation)
  .delete(controller.deleteLocation);

router.route("/weather/:location_id").get(controller.getWeatherByLocationId);

router.route("/history").get(controller.getPastWeatherData);

module.exports = router;
