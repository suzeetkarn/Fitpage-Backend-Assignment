const Location = require("../../model/location.model");
const httpStatus = require("http-status");
const APIError = require("../../errors/api-error");
const weatherService = require("../../services/index");
const { createRedisClient } = require("../../../config/redis");

const redisClient = createRedisClient();
(async () => {
  await redisClient.connect();
})();


exports.getWeatherByLocationId = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.location_id);
    if (!location) return res.status(404).json({ error: "Location not found" });

    const cacheKey = `${location.latitude},${location.longitude}`;
    const cachedWeather = await redisClient.get(cacheKey);

    if (cachedWeather) {
      return res.json(JSON.parse(cachedWeather));
    }

    const response = await weatherService.getWeatherData(
      location.latitude,
      location.longitude
    );
    if (!response) {
      throw new APIError({
        message: "Internal server error",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const weatherData = response.data;
    await redisClient.set(cacheKey, JSON.stringify(weatherData), "EX", 600);

    res.json(weatherData);
  } catch (error) {
    return next(error);
  }
};
