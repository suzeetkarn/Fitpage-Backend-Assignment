const axios = require("axios");
const { wheatherApiKey, wheatherHistoryApiUrl } = require("../../config/vars");

const getWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(wheatherApiUrl, {
      params: {
        key: wheatherApiKey,
        q: `${latitude},${longitude}`,
      },
    });
    if (resp && !resp.isAxiosError) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
};

const fetchWeatherData = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
};

const getHistoricalWeather = async (
  latitude,
  longitude,
  startDate,
  endDate
) => {
  try {
    console.log(
      "latitude, longitude, startDate, endDate",
      latitude,
      longitude,
      startDate,
      endDate
    );
    const weatherData = await fetchWeatherData(wheatherHistoryApiUrl, {
      key: wheatherApiKey,
      q: `${latitude},${longitude}`,
      dt: startDate,
      end_dt: endDate,
    });

    if (weatherData && !weatherData.isAxiosError) {
      return weatherData;
    }
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
};

module.exports = {
  getWeatherData,
  getHistoricalWeather,
};
