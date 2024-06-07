const Location = require("../model/location.model");

////////////////////Location API's (GET,POST, UPDATE, DELETE)/////////////////////////////
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.getAllLocations();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addLocation = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
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

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.getLocationById(req.params.location_id);
    res.json(location);
  } catch (error) {
    res.status(404).json({ error: "Location not found" });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const updatedLocation = await Location.updateLocation(
      req.params.location_id,
      { name, latitude, longitude }
    );
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const deletedLocation = await Location.deleteLocation(
      req.params.location_id
    );
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(404).json({ error: "Location not found" });
  }
};
