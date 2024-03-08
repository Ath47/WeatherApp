import React, { useState } from "react";
import invalidCityImage from "../images/404.png";
import homeImage from "../images/home.png";
import clearImg from "../images/clear.png";
import cloudImg from "../images/cloud.png";
import rainImg from "../images/rain.png";
import snowImg from "../images/snow.png";
import mistImg from "../images/mist.png";
import smokeImg from "../images/smoke.jpg";

export default function LocationForm() {
  const [city, setCity] = useState("");
  const [invalidCity, setInvalidCity] = useState(false);
  const [validCity, setValidCity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [desc, setDesc] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);

  const API_KEY = "Your API key";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city === "") {
      setInvalidCity(true);
      setSubmitted(true);
      setValidCity(false);
    } else {
      setInvalidCity(false);
      setSubmitted(true);
      fetchWeatherData(city);
    }
  };

  const fetchWeatherData = (cityName) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.cod === "404") {
          setInvalidCity(true);
          setValidCity(false);
          setImageSrc(null);
          return;
        }

        switch (json.weather[0].main) {
          case "Clear":
            setImageSrc(clearImg);
            break;

          case "Rain":
            setImageSrc(rainImg);
            break;

          case "Snow":
            setImageSrc(snowImg);
            break;

          case "Clouds":
            setImageSrc(cloudImg);
            break;

          case "Haze":
            setImageSrc(mistImg);
            break;

          case "Smoke":
            setImageSrc(smokeImg);
            break;
          default:
        }
        setTemperature(`${parseInt(json.main.temp)}°C`);
        setHumidity(`${json.main.humidity}%`);
        setWind(`${parseInt(json.wind.speed)}Km/h`);
        setDesc(`${json.weather[0].description}`);
        setCity(cityName);
        setValidCity(true);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  const handleChange = (e) => {
    setCity(e.target.value);
    setInvalidCity(false);
    setValidCity(false);
    setImageSrc(null);
    setSubmitted(false);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          )
            .then((response) => response.json())
            .then((json) => {
              fetchWeatherData(json.name);
            })
            .catch((error) => {
              console.error("Error fetching current location weather:", error);
            });
        },
        function (error) {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  function GoTo5dayForecast() {
    window.location.href = `/FiveDayForecastPage/` + city;
  }

  const convertTemperature = (tempInCelsius) => {
    if (isCelsius) {
      return `${tempInCelsius}°C`;
    } else {
      const tempInFahrenheit = (tempInCelsius * 9) / 5 + 32;
      return `${tempInFahrenheit}°F`;
    }
  };

  return (
    <div>
      <form className="flex justify-between gap-2" onSubmit={handleSubmit}>
        <input
          placeholder="Enter a city name"
          className="w-4/5 rounded-md p-2 mt-2 border"
          value={city}
          onChange={handleChange}
        />
        <button className="bg-slate-600 text-white px-3 mt-2 rounded-md">
          Go
        </button>
        <button
          className="bg-slate-600 text-white px-3 mt-2 rounded-md"
          onClick={getCurrentLocation}
        >
          Use Current Location
        </button>
      </form>

      {validCity && (
        <div className="text-slate-600 font-bold validCity text-center mt-3">
          <p>City: {city}</p>
          <p className="cursor-pointer">
            Temperature:{" "}
            <span onClick={toggleTemperatureUnit}>
              {convertTemperature(parseInt(temperature))}
            </span>
          </p>
          <p>Description: {desc}</p>
          <p>Humidity: {humidity}</p>
          <p>Wind: {wind}</p>
          {imageSrc && <img src={imageSrc} alt="" className="mb-3 mt-0" />}
          <button className="goTo5Day" onClick={GoTo5dayForecast}>
            Get 5 days Forecast
          </button>
        </div>
      )}

      {!submitted && (
        <div className="text-center text-red-600 font-bold">
          <img src={homeImage} alt="Home" className="mb-3" />
        </div>
      )}

      {invalidCity && (
        <div className="text-center text-red-600 font-bold mt-4">
          <h3>Enter a valid city name!</h3>
          <img src={invalidCityImage} alt="Invalid City" className="mt-4" />
        </div>
      )}
    </div>
  );
}
