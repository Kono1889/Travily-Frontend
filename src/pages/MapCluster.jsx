import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterLayer from "../components/MarkerClusterLayer"; // adjust path as needed
import axios from "axios";
import toast from "react-hot-toast";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

// Utility component to zoom to marker bounds
const ZoomToFit = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const FlyToLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16); // or map.setView(position, 16, { animate: true })
    }
  }, [position, map]);

  return null;
};

const MapCluster = () => {
  const mapRef = useRef();

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("tourism.sights");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bounds, setBounds] = useState([]);
  const [center, setCenter] = useState([5.6, -0.2]); // Default center: Accra
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleSearch = async () => {
    if (!city.trim()) {
      toast.error("Please enter a city name.");
      return;
    }

    setLoading(true);
    setPlaces([]);
    setBounds([]);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/places?city=${city}&category=${category}`
      );
      const results = res.data.places || res.data;

      if (results.length === 0) {
        toast.error("No places found for this city.");
        return;
      }

      setCenter([results[0].lat, results[0].lon]);
      setPlaces(results);

      // Generate bounds for all markers
      const markerBounds = results.map((p) => [p.lat, p.lon]);
      setBounds(markerBounds);
      toast.success("Places loaded successfully!");
    } catch (err) {
      console.error("Failed to fetch places:", err);
      toast.error("Error fetching places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Search Section */}
      <div className="mb-6 mt-16 max-w-3xl w-full">
        <h2 className="text-xl mb-3 font-semibold">Search City & Places</h2>
        <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
          {/* City Input */}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 px-4 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
            disabled={loading}
          />
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300" />
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 px-4 py-3 text-sm bg-transparent text-gray-800 focus:outline-none"
            disabled={loading}
          >
            <option value="tourism.sights">Tourist Attractions</option>
            <option value="catering.restaurant">Restaurants</option>
            <option value="entertainment.museum">Museums</option>
            <option value="leisure.park">Parks</option>
            <option value="accommodation.hotel">Hotels</option>
          </select>
          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full flex items-center justify-center transition duration-200 m-1"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Map + Sidebar */}
      <div className="flex gap-6 ">
        {/* Sidebar List */}
        <div className="w-1/3 h-[500px] overflow-y-auto bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Places Found</h3>
          {places.length === 0 && (
            <p className="text-sm text-gray-500">No places to display.</p>
          )}
          {places.map((p, index) => (
            <div
              key={p.id || index}
              className="mb-4 p-3 shadow-lg hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => {
                setSelectedPosition([p.lat, p.lon]);
              }}
            >
              <h4 className="text-md font-semibold text-gray-900">
                {p.name || "Unnamed Place"}
              </h4>
              <p className="text-sm text-gray-700">
                {p.address || p.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
        {/* Map Section */}
        <div className="w-2/3 h-[500px] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)} // capture map instance
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <ZoomToFit bounds={bounds} />
            <FlyToLocation position={selectedPosition} />

            <MarkerClusterLayer markers={places} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapCluster;
