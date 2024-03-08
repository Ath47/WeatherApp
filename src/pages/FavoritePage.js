import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function FavoritePage() {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    const savedCities = localStorage.getItem("favoriteCities");
    if (savedCities) {
      setCities(JSON.parse(savedCities));
      console.log(
        "Cities retrieved from localStorage:",
        JSON.parse(savedCities)
      );
    }
  }, []);

  function addCities(event) {
    event.preventDefault();
    if (newCity.trim() !== "") {
      const updatedCities = [...cities, newCity.trim()];
      console.log("Updated cities:", updatedCities);
      setCities(updatedCities);
      localStorage.setItem("favoriteCities", JSON.stringify(updatedCities));
      setNewCity("");
    }
  }

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-slate-100 rounded-lg p-6 shadow-md w-2/3 h-3/4">
        <Header />
        <h1 className="text-xl text-center mt-2 text-slate-600">Your Favorite Cities</h1>
        <form className="flex justify-between mt-4" onSubmit={addCities}>
          <input
            type="text"
            placeholder="Enter your favorite city"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="p-2 ml-2 rounded-lg w-4/5"
          />
          <button
            type="submit"
            className="bg-slate-600 text-white rounded-md p-2"
          >
            Add
          </button>
        </form>
        <div className="mt-4">
          {cities.map((city, index) => (
            <Link
              to={`/FiveDayForecastPage/${city}`}
              key={index}
              className="bg-slate-200 rounded-md p-2 m-2 block text-center"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
