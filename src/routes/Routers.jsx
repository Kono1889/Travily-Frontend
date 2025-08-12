import { Route, Routes } from "react-router-dom";
import Layout from "../pages/Layout";
import MapCluster from "../pages/MapCluster";
import Budget from "../pages/Budget";
import ItineraryPreference from "../pages/ItineraryPreference";
import Home from "../pages/Home";
import PlaceDetails from "../components/PlaceDetails";
import News from "../pages/News";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cluster" element={<MapCluster />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/itineraryPreference" element={<ItineraryPreference />} />
      <Route path="/place/:name" element={<PlaceDetails />} />
      <Route path="/news" element={<News />} />
    </Routes>
  );
};

export default Routers;
