const Location = require("../model/location.model");
const httpStatus = require("http-status");
const APIError = require("../../errors/api-error");
const { wheatherApiKey } = require("../../config/vars");

const { createRedisClient } = require("../../config/redis");

const redisClient = createRedisClient();
(async () => {
  await redisClient.connect();
})();

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

/////////////////////////////---Weather API---/////////////////////////////

exports.getWeatherByLocationId = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.location_id);
    if (!location) return res.status(404).json({ error: "Location not found" });

    const cacheKey = `${location.latitude},${location.longitude}`;
    const cachedWeather = await redisClient.get(cacheKey);

    if (cachedWeather) {
      return res.json(JSON.parse(cachedWeather));
    }

    const response = await axios.get(process.env.WEATHER_API_URL, {
      params: {
        key: wheatherApiKey,
        q: `${location.latitude},${location.longitude}`,
      },
    });
    if (!response) {
      throw new APIError({
        message: "Internal server error",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const weatherData = response.data;
    await redisClient.set(cacheKey, JSON.stringify(weatherData), "EX", 86400);

    res.json(weatherData);
  } catch (error) {
    return next(error);
  }
};
