require("dotenv").config();
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  redisURI: process.env.REDIS_URI,
  mongo: {
    app_uri: process.env.MONGO_URI_APP,
    db_name: process.env.MONGO_DB_NAME,
  },
  wheatherApiKey: process.env.WEATHER_API_KEY,
  wheatherApiUrl: process.env.WEATHER_API_URL,
  wheatherHistoryApiUrl: process.env.WEATHER_HISTORY_API_URL,
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
};
