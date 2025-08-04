import { Route, Routes } from "react-router-dom";
import Layout from "../pages/Layout";
import MapCluster from "../pages/MapCluster";
import Budget from "../pages/Budget";
import ItineraryPreference from "../pages/ItineraryPreference";
import Home from "../pages/Home";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cluster" element={<MapCluster />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/itineraryPreference" element={<ItineraryPreference />} />
    </Routes>
  );
};

export default Routers;
