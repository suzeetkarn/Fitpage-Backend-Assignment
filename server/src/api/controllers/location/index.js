const Location = require("../../model/location.model");
const httpStatus = require("http-status");
const APIError = require("../../errors/api-error");

////////////////////----Location API's (GET,POST, UPDATE, DELETE)----/////////////////////////////

exports.getAllLocations = async (req, res, next) => {
  try {
    const locations = await Location.getAllLocations();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addLocation = async (req, res, next) => {
  try {
    const { name, latitude, longitude } = req.body;
    const existingLocation = await Location.findOne({
      name,
      latitude,
      longitude,
    });
    if (existingLocation) {
      return res.status(400).json({ error: "Location already present" });
    }
    const newLocation = await Location.createLocation(
      name,
      latitude,
      longitude
    );
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
};

exports.getLocationById = async (req, res, next) => {
  try {
    const location = await Location.getLocationById(req.params.location_id);
    console.log("location===========",location);
    if (location) {
      res.json(location);
    } else {
      throw new APIError({
        message: "Location not found",
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const { name, latitude, longitude } = req.body;
    const updatedLocation = await Location.updateLocation(
      req.params.location_id,
      { name, latitude, longitude }
    );
    if (updatedLocation) {
      res.json(updatedLocation);
    } else {
      throw new APIError({
        message: "Location not found",
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.deleteLocation = async (req, res, next) => {
  try {
    const deletedLocation = await Location.deleteLocation(
      req.params.location_id
    );
    if (deletedLocation) {
      res.json({ message: "Location deleted" });
    } else {
      throw new APIError({
        message: "Location not found",
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    return next(error);
  }
};

