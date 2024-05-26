import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import clearImg from "../images/clear.png";
import cloudImg from "../images/cloud.png";
import rainImg from "../images/rain.png";
import snowImg from "../images/snow.png";
import mistImg from "../images/mist.png";
import ClipLoader from "react-spinners/ClipLoader";

export default function SixDayForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const { city } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city) {
      fetchForecastData(city);
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [city]);

  const fetchForecastData = (city) => {
    const KEY = process.env.REACT_APP_WEATHER_Key;
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((json) => {
        const forecastList = json.list;

        const filteredForecast = forecastList.reduce((acc, forecast) => {
          const date = forecast.dt_txt.split(" ")[0];
          if (!acc[date]) {
            acc[date] = forecast;
          } else {
            const existingTime = new Date(acc[date].dt_txt).getHours();
            const newTime = new Date(forecast.dt_txt).getHours();
            if (Math.abs(newTime - 12) < Math.abs(existingTime - 12)) {
              acc[date] = forecast;
            }
          }
          return acc;
        }, {});
        const forecastDataArray = Object.values(filteredForecast);
        setForecastData(forecastDataArray);
      })
      .catch((error) => {
        console.error("Error fetching forecast:", error);
        setForecastData([]);
      });
  };

  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case "Clear":
        return clearImg;
      case "Rain":
        return rainImg;
      case "Snow":
        return snowImg;
      case "Clouds":
        return cloudImg;
      case "Haze":
        return mistImg;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-slate-100 rounded-lg p-6 shadow-md w-2/3 h-3/4">
        <Header />
        <div className="forecast-container text-center mt-2">
          <h2 className="font-bold text-slate-600">
            6-Day Forecast for {city}
          </h2>
          {loading && (
            <div className="mt-4">
              <h3 className="mb-4">Fetching data, this might take few seconds</h3>
              <ClipLoader size={80}/>
            </div>
          )}
          {!loading && (
            <Slider dots infinite arrows className="mt-5">
              {forecastData && forecastData.length > 0 ? (
                forecastData.map((forecast, index) => (
                  <div key={index} className="forecast-item">
                    <p>Date: {forecast.dt_txt}</p>
                    <p>
                      Temperature: {(forecast.main.temp - 273.15).toFixed(2)}°C
                    </p>
                    <p>Humidity: {forecast.main.humidity}%</p>
                    <p>Weather: {forecast.weather[0].description}</p>
                    {getWeatherIcon(forecast.weather[0].main) && (
                      <img
                        src={getWeatherIcon(forecast.weather[0].main)}
                        alt="Weather Icon"
                        className="fiveDaysImg"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>No forecast data available for {city}</p>
              )}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
}
