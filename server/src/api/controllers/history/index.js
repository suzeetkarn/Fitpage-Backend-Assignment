const Location = require("../../model/location.model");
const httpStatus = require("http-status");
const axios = require("axios");
const APIError = require("../../errors/api-error");
const { wheatherApiKey, wheatherApiUrl } = require("../../../config/vars");

const { createRedisClient } = require("../../../config/redis");

const redisClient = createRedisClient();
(async () => {
  await redisClient.connect();
})();

/////////////////////////////---Weather API---/////////////////////////////

exports.getPastWeatherData = async (req, res, next) => {
    try {
      const location = await Location.findById(req.params.location_id);
      if (!location) return res.status(404).json({ error: "Location not found" });
  
      const cacheKey = `${location.latitude},${location.longitude}`;
      const cachedWeather = await redisClient.get(cacheKey);
  
      if (cachedWeather) {
        return res.json(JSON.parse(cachedWeather));
      }
  
      const response = await axios.get(wheatherApiUrl, {
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
      await redisClient.set(cacheKey, JSON.stringify(weatherData), "EX", 3600);
  
      res.json(weatherData);
    } catch (error) {
      return next(error);
    }
  };
  