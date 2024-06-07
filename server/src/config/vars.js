const path = require("path");

// import .env variables
require("dotenv").config();
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    app_uri: process.env.MONGO_URI_APP,
    db_name: process.env.MONGO_DB_NAME,
  },
  openWheatherApiKey: process.env.OPEN_WEATHER_API_KEY,
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
};
