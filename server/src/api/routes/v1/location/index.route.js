const express = require("express");
const controller = require("../../../controllers/location");

const router = express.Router();

router.route("/").get(controller.getAllLocations).post(controller.addLocation);

router
  .route("/:location_id")
  .get(controller.getLocationById)
  .put(controller.updateLocation)
  .delete(controller.deleteLocation);

module.exports = router;
