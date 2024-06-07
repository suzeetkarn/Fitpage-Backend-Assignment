const axios = require("axios");
const { wheatherApiKey, wheatherApiUrl } = require("../../config/vars");

const getWeatherData = async (latitude, longitude) => {
    try {
        const response = await axios.get(wheatherApiUrl, {
            params: {
                key: wheatherApiKey,
                q: `${latitude},${longitude}`
            }
        });
        if(resp && !resp.isAxiosError){
            return response.data;
        }
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }
}

module.exports = {
    getWeatherData
};