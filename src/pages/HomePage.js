import React from "react";
import LocationForm from "../components/LocationForm";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-slate-100 rounded-lg p-6 shadow-md w-2/3 h-3/4">
        <Header />
        <LocationForm />
      </div>
    </div>
  );
}
