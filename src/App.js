import "./styles/App.css";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import FavoritePage from "./pages/FavoritePage";
import SixDayForecastPage from "./pages/SixDayForecastPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/FavoritePage" element={<FavoritePage />} />
      <Route path="/FiveDayForecastPage/:city" element={<SixDayForecastPage />} />
    </Routes>
  );
}

export default App;
