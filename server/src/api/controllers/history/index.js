const Location = require("../../model/location.model");
const { createRedisClient } = require("../../../config/redis");
const weatherService = require("../../services/index");

const redisClient = createRedisClient();
(async () => {
  await redisClient.connect();
})();

exports.getPastWeatherData = async (req, res) => {
  try {
    const location = await Location.findOne({ uid: req.params.location_id });
    if (!location) return res.status(404).json({ error: "Location not found" });
    const { days } = req.query;
    const dayRange = parseInt(days);

    const cacheKey = `history:${location.latitude},${location.longitude}:${days}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    if (![7, 15, 30].includes(dayRange)) {
      return res
        .status(400)
        .json({ error: " Only past 7, 15, and 30 days are allowed." });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayRange);
    const startDateString = startDate.toISOString().split("T")[0];
    const endDateString = new Date().toISOString().split("T")[0];

    const weatherData = await weatherService.getHistoricalWeather(
      location.latitude,
      location.longitude,
      startDateString,
      endDateString
    );

    await redisClient.set(cacheKey, JSON.stringify(weatherData), "EX", 600);

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
