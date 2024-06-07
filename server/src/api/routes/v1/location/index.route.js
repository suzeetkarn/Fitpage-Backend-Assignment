const express = require("express");
const { validate } = require('express-validation');
const controller = require("../../../controllers/location");

const router = express.Router();
const {
  location
} = require('../../../validations/index');

router.route("/")
.get(controller.getAllLocations)
.post(validate(location),controller.addLocation);

router
  .route("/:location_id")
  .get(controller.getLocationById)
  .put(controller.updateLocation)
  .delete(controller.deleteLocation);

module.exports = router;
