const WeatherData = require('../models/WeatherData');

// @desc    Get weather for a location or default farm region
// @route   GET /api/weather
// @access  Public
const getWeather = async (req, res, next) => {
  try {
    const { location } = req.query;
    let query = {};
    if (location) {
      query.locationName = new RegExp(location, 'i');
    }

    let weather = await WeatherData.findOne(query).sort({ updatedAt: -1 });

    // Fallback if none in db yet
    if (!weather) {
      weather = {
        locationName: location || 'Nagpur / Vidarbha Agro-Zone',
        state: 'Maharashtra',
        coordinates: { latitude: 21.1458, longitude: 79.0882 },
        current: {
          temperature: 29.4,
          feelsLike: 31.2,
          humidity: 58,
          windSpeed: 14,
          precipitationChance: 15,
          condition: 'Partly Sunny',
          uvIndex: 7,
          airQualityIndex: 48,
          updatedAt: new Date(),
        },
        forecast: [
          { day: 'Mon', date: 'Oct 28', condition: 'Sunny', tempMax: 32, tempMin: 21, humidity: 55, rainProbability: 10 },
          { day: 'Tue', date: 'Oct 29', condition: 'Partly Cloudy', tempMax: 31, tempMin: 22, humidity: 62, rainProbability: 25 },
          { day: 'Wed', date: 'Oct 30', condition: 'Scattered Showers', tempMax: 28, tempMin: 20, humidity: 78, rainProbability: 65 },
          { day: 'Thu', date: 'Oct 31', condition: 'Overcast', tempMax: 29, tempMin: 19, humidity: 70, rainProbability: 40 },
          { day: 'Fri', date: 'Nov 01', condition: 'Clear', tempMax: 30, tempMin: 18, humidity: 50, rainProbability: 5 },
        ],
        agriculturalAdvisories: [
          'High humidity expected midweek: ensure drainage trenches in cotton & soybean fields are unblocked.',
          'Postpone foliar pesticide sprays until Thursday afternoon to avoid rainwater wash-off.',
          'Ideal window for early morning micro-irrigation between 6:00 AM - 9:00 AM to prevent evaporative loss.',
        ],
      };
    }

    res.json({ success: true, data: weather });
  } catch (error) {
    next(error);
  }
};

// @desc    Update or seed weather data
// @route   POST /api/weather
// @access  Private (Admin)
const updateWeather = async (req, res, next) => {
  try {
    const { locationName, state, coordinates, current, forecast, agriculturalAdvisories } = req.body;

    const weather = await WeatherData.findOneAndUpdate(
      { locationName },
      { locationName, state, coordinates, current, forecast, agriculturalAdvisories },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: weather });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeather, updateWeather };
