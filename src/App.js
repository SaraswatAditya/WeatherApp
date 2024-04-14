import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CityTable from "./components/CityTable";
import Search from "./components/search";
import "./App.css";
import { WEATHER_API_KEY, WEATHER_API_URL, GEO_API_URL } from "./api";
import CurrentWeather from "./components/current-weather";
import Forecast from "./components/forecast";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleCityClick = (cityName) => {
    // Fetch coordinates of the clicked city
    fetch(`${GEO_API_URL}&where=name%20like%20%22${cityName}%22&limit=1`)
      .then((response) => response.json())
      .then((data) => {
        const cityData = data.results[0];
        const lat = cityData.coordinates.lat;
        const lon = cityData.coordinates.lon;
        fetchWeatherData(lat, lon, cityName.label);
      });
  };

  const fetchWeatherData = (lat, lon, cityLabel) => {
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const [currentWeatherResponse, forecastResponse] = await Promise.all(response.map(res => res.json()));
        setCurrentWeather({ city: cityLabel, ...currentWeatherResponse });
        setForecast({ city: cityLabel, ...forecastResponse });
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  const handleOnSearchChange = (searchData) => {
    console.log(searchData);
    const [lat, lon] = searchData.value.split(" ");
    fetchWeatherData(lat, lon, searchData.label);
  };

  console.log(currentWeather);
  console.log(forecast);

  return (
    <>
      <h1>Weather App</h1>
      <div className="container">
        <Search onSearchChange={handleOnSearchChange} />
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast && <Forecast data={forecast} />}
      </div>
      <Router>
        <div className="App">
          <Routes>
            <Route
              exact
              path="/"
              element={<CityTable onCityClick={handleCityClick} />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
