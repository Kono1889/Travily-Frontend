// components/SearchBar.jsx (updated)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from "../contexts/AuthContexts";
import AuthModal from "./AuthModal"; 

const SearchBar = () => {
  const navigate = useNavigate();
  const { user, isAnonymous, token } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Modal state

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [localHistory, setLocalHistory] = useState(() => {
    if (isAnonymous) {
      const stored = localStorage.getItem("searchHistory");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Fetch autocomplete from backend with auth headers
  const fetchSuggestions = async (text) => {
    if (!text) return;
    try {
      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const res = await axios.get(
        `/api/geoapify/autocomplete?text=${text}`,
        config
      );
      setSuggestions(res.data.features || []);
    } catch (err) {
      console.error("Autocomplete failed", err);
    }
  };

  const fetchPlaces = async (place) => {
    const { lat, lon, formatted } = place.properties;
    try {
      setLoading(true);

      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const res = await axios.get(
        `/api/geoapify/places?lat=${lat}&lon=${lon}&category=tourism.sights&radius=2000&destinationName=${encodeURIComponent(
          formatted
        )}`,
        config
      );

      const filtered = (res.data.features || []).filter(
        (p) => p.properties.name && p.properties.name.trim() !== ""
      );

      setResults(filtered);

      if (isAnonymous) {
        const updatedHistory = [
          formatted,
          ...localHistory.filter((h) => h !== formatted),
        ].slice(0, 5);
        setLocalHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error("Places fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (suggestions.length > 0) {
      fetchPlaces(suggestions[0]);
      setQuery(suggestions[0].properties.formatted);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!isAnonymous && token) {
      // Fetch user’s saved history from backend
      const fetchUserHistory = async () => {
        try {
          const res = await axios.get("/api/user/history", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLocalHistory(res.data.history || []); 
        } catch (err) {
          console.error("Failed to fetch user history", err);
        }
      };
      fetchUserHistory();
    }
  }, [isAnonymous, token]);

  const showHistory = () => {
    return localHistory.map((item) => ({
      properties: { formatted: item },
    }));
  };

  return (
    <>
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        
        {/* Authenticated User Welcome */}
        {!isAnonymous && user && (
          <motion.div
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-800 text-sm flex items-center gap-2">
              <span>👋</span>
              Welcome back, {user.username || user.email}! Your searches are
              being saved.
            </p>
          </motion.div>
        )}

        <div className="relative flex items-center shadow-lg">
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search hotels, destinations or places..."
            className="w-full pl-10 pr-24 py-4 border border-gray-300 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (value.length > 2) fetchSuggestions(value);
              else setSuggestions([]);
            }}
            onFocus={() => {
              if (!query && localHistory.length > 0) {
                setSuggestions(showHistory());
              }
            }}
          />

          {/* Search Button */}
          <button
            className="absolute right-0 top-0 h-full px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-r-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSearch}
            disabled={loading || suggestions.length === 0}
          >
            {loading ? <ClipLoader size={18} color="#ffffff" /> : "Search"}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="bg-white mt-1 rounded shadow-md max-h-48 overflow-y-auto border border-gray-200">
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="p-3 hover:bg-gray-100 text-gray-600 text-left cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  fetchPlaces(sug);
                  setQuery(sug.properties.formatted);
                  setSuggestions([]);
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{sug.properties.formatted}</span>
                  {localHistory.includes(sug.properties.formatted) && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                      History
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Search Results */}
        <div className="mt-6 space-y-4">
          {results.map((place, idx) => {
            const placeName = place.properties.name || "Unnamed place";
            const formattedName = encodeURIComponent(
              place.properties.formatted
            );

            return (
              <div
                key={idx}
                onClick={() =>
                  navigate(`/place/${formattedName}`, {
                    state: {
                      lat: place.properties.lat,
                      lon: place.properties.lon,
                      formatted: place.properties.formatted,
                    },
                  })
                }
                className="border rounded-lg p-4 bg-white shadow flex gap-4 items-start cursor-pointer hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <h2 className="text-lg text-gray-600 font-semibold">
                    {placeName}
                  </h2>
                  <p className="text-gray-600">{place.properties.formatted}</p>
                  <p className="text-sm text-gray-500 italic">
                    Category: {place.properties.categories?.[0] || "N/A"}
                  </p>
                  {!isAnonymous && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Saved to your search history
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default SearchBar;
