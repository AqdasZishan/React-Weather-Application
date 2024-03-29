import React, { useState, useEffect } from 'react';
import './Weather.css';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [error, setError] = useState('');
  const [getWeatherClicked, setGetWeatherClicked] = useState(false);

  const apiKey = 'use your API key';

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${temperatureUnit}`
      );
      console.log(response);
      setWeatherData(response.data);
      setError('');
    } catch (error) {
      setWeatherData(null);
      if (error.response && error.response.status === 404) {
        setError(`City "${city}" not found.`);
      } 
      else if(error.response.status === 400) {
        setError('Please Enter a City.');
      } else {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data. Please try again.');
      }
    }
  };

  const toggleTemperatureUnit = () => {
    setGetWeatherClicked(true);
    setTemperatureUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const handleGetWeatherClick = () => {
    setGetWeatherClicked(true);
    getWeather();
  };

  useEffect(() => {
    if (getWeatherClicked) {
      getWeather();
      setGetWeatherClicked(false);
    }
  }, [getWeatherClicked, temperatureUnit]);

  return (
    <div className="container">
      <div className="input-container">
        <h1>Weather App</h1>
        <input
            type="text"
            placeholder="Enter City Name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleGetWeatherClick}>Get Weather</button>
        <button onClick={toggleTemperatureUnit}>
            To {temperatureUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>
      </div>
      
      <div className="result-container">
        {weatherData ? (
          <div className="weather-container">
            <div className='top'>
                <h2>
                {weatherData.name}, {weatherData.sys.country}
                </h2>
                <span id='imgSpan'>
                    <h3>{weatherData.weather[0].main}</h3>
                    <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                        alt="Weather Icon"
                    />
                </span>
            </div>
            <span>
              <p><b>Temperature:</b> {weatherData.main.temp}°{temperatureUnit === 'metric' ? 'C' : 'F'}</p>
              <p><b>Feels Like:</b> {weatherData.main.feels_like}°{temperatureUnit === 'metric' ? 'C' : 'F'}</p>
            </span>
            <span>
              <p><b>Weather:</b> {weatherData.weather[0].description.capitalize()}</p>
              <p><b>Visibilty:</b> {weatherData.visibility}m</p>
            </span>
            <span>
                <p><b>Min Temperature:</b> {weatherData.main.temp_min}°{temperatureUnit === 'metric' ? 'C' : 'F'}</p>
                <p><b>Max Temperature:</b> {weatherData.main.temp_max}°{temperatureUnit === 'metric' ? 'C' : 'F'}</p>
            </span>
            <span>
                <p><b>Humidity:</b> {weatherData.main.humidity}%</p>
                <p><b>Pressure:</b> {weatherData.main.pressure}Pa</p>
            </span>
            <span>
                
                <p></p>
            </span>
          </div>
        ) : (
          error && <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default Weather;
