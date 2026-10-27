import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  CloudSun,
  Droplets,
  Wind,
  Compass,
  Thermometer,
  Sun,
  CloudRain,
  ShieldAlert,
  Search,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const WeatherForecast = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (loc = '') => {
    try {
      setLoading(true);
      const url = loc ? `/weather?location=${encodeURIComponent(loc)}` : '/weather';
      const res = await API.get(url);
      setWeather(res.data.data);
    } catch (err) {
      console.error('Weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      fetchWeather(searchLocation.trim());
    }
  };

  return (
    <div className="container py-4">
      {/* Header & Search */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <CloudSun className="text-warning" size={28} />
            <span>Agro-Meteorological Forecast & Advisories</span>
          </h2>
          <p className="text-muted small mb-0">
            Real-time hyper-local climate modeling tailored for irrigation scheduling, spray timing, and harvest protection.
          </p>
        </div>

        <form onSubmit={handleSearch} className="d-flex gap-2" style={{ maxWidth: '320px' }}>
          <input
            type="text"
            placeholder="Search district / agro-zone..."
            className="form-control form-control-sm"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <button type="submit" className="agri-btn-primary btn-sm px-3">
            <Search size={14} />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted small mt-2">Connecting to agricultural weather station...</p>
        </div>
      ) : !weather ? (
        <div className="agri-card text-center py-5">
          <p>No climate data available.</p>
        </div>
      ) : (
        <>
          {/* Main Weather Card */}
          <div className="agri-card-dark p-4 p-md-5 mb-4 position-relative overflow-hidden">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-20 text-success small fw-semibold mb-2">
                  <span>Live Agricultural Sensor Network</span>
                </div>
                <h2 className="fw-bold text-white display-6 mb-1">{weather.locationName}</h2>
                <p className="text-secondary small mb-3">
                  {weather.state} • Coordinates: {weather.coordinates?.latitude?.toFixed(2)}°N, {weather.coordinates?.longitude?.toFixed(2)}°E
                </p>

                <div className="d-flex align-items-baseline gap-4 my-3">
                  <span className="display-3 fw-extrabold text-white">
                    {weather.current.temperature}°<span className="fs-3 text-success">C</span>
                  </span>
                  <div>
                    <h5 className="text-warning fw-bold mb-0">{weather.current.condition}</h5>
                    <span className="text-secondary small">Feels like {weather.current.feelsLike}°C</span>
                  </div>
                </div>
              </div>

              {/* 4 Param Cards */}
              <div className="col-lg-5">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      <div className="d-flex align-items-center gap-2 text-info mb-1">
                        <Droplets size={18} />
                        <span className="small text-secondary">Humidity</span>
                      </div>
                      <h4 className="fw-bold text-white mb-0">{weather.current.humidity}%</h4>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      <div className="d-flex align-items-center gap-2 text-success mb-1">
                        <Wind size={18} />
                        <span className="small text-secondary">Wind Speed</span>
                      </div>
                      <h4 className="fw-bold text-white mb-0">{weather.current.windSpeed} km/h</h4>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      <div className="d-flex align-items-center gap-2 text-warning mb-1">
                        <Sun size={18} />
                        <span className="small text-secondary">UV Index</span>
                      </div>
                      <h4 className="fw-bold text-white mb-0">{weather.current.uvIndex} (High)</h4>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      <div className="d-flex align-items-center gap-2 text-primary mb-1">
                        <CloudRain size={18} />
                        <span className="small text-secondary">Rain Probability</span>
                      </div>
                      <h4 className="fw-bold text-white mb-0">{weather.current.precipitationChance}%</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <Calendar size={18} className="text-success" />
            <span>5-Day Micro-Agro Forecast</span>
          </h5>

          <div className="row g-3 mb-4">
            {weather.forecast?.map((day, index) => (
              <div key={index} className="col-md col-sm-6">
                <div className="agri-card h-100 p-3 text-center border-0">
                  <span className="d-block fw-bold text-dark">{day.day}</span>
                  <span className="small text-muted">{day.date}</span>

                  <div className="my-2 py-1 text-warning">
                    {day.condition.toLowerCase().includes('rain') ? (
                      <CloudRain size={30} className="text-info mx-auto" />
                    ) : (
                      <CloudSun size={30} className="text-warning mx-auto" />
                    )}
                  </div>

                  <span className="d-block small fw-bold text-dark mb-1">{day.condition}</span>
                  <div className="d-flex justify-content-center align-items-baseline gap-2 small">
                    <strong className="text-dark">{day.tempMax}°</strong>
                    <span className="text-muted">{day.tempMin}°</span>
                  </div>

                  <div className="mt-2 pt-2 border-top small text-muted d-flex justify-content-between" style={{ fontSize: '0.75rem' }}>
                    <span>Rain:</span>
                    <span className="text-info fw-bold">{day.rainProbability}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Agricultural Advisories */}
          <div className="agri-card p-4 border-0">
            <h5 className="fw-bold mb-3 text-success d-flex align-items-center gap-2">
              <ShieldAlert size={20} />
              <span>Agronomic Planning Advisories for this Week</span>
            </h5>
            <div className="d-flex flex-column gap-2">
              {weather.agriculturalAdvisories?.map((adv, index) => (
                <div key={index} className="p-3 bg-light rounded-3 d-flex align-items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-success mt-0.5 flex-shrink-0" />
                  <p className="mb-0 small text-dark fw-medium leading-relaxed">{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherForecast;
