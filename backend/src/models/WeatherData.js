const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: 'Maharashtra',
  },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  current: {
    temperature: { type: Number, required: true },
    feelsLike: { type: Number, required: true },
    humidity: { type: Number, required: true }, // percentage
    windSpeed: { type: Number, required: true }, // km/h
    precipitationChance: { type: Number, default: 10 }, // %
    condition: { type: String, required: true }, // e.g. Sunny, Part Cloudy, Rain
    uvIndex: { type: Number, default: 6 },
    airQualityIndex: { type: Number, default: 52 },
    updatedAt: { type: Date, default: Date.now },
  },
  forecast: [{
    day: { type: String, required: true },
    date: { type: String, required: true },
    condition: { type: String, required: true },
    tempMax: { type: Number, required: true },
    tempMin: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainProbability: { type: Number, required: true },
  }],
  agriculturalAdvisories: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);
