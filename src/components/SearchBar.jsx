import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("searchHistory");
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch autocomplete from backend
  const fetchSuggestions = async (text) => {
    if (!text) return;
    try {
      const res = await axios.get(`/api/geoapify/autocomplete?text=${text}`);
      console.log("Suggestion response:", res.data); // DEBUG

      setSuggestions(res.data.features || []);
    } catch (err) {
      console.error("Autocomplete failed", err);
    }
  };

  // Fetch nearby places using selected suggestion
  const fetchPlaces = async (place) => {
    const { lat, lon, formatted } = place.properties;
    try {
      const res = await axios.get(
        `/api/geoapify/places?lat=${lat}&lon=${lon}&category=tourism.sights&radius=2000`
      );
      setResults(res.data.features || []);

      const updatedHistory = [
        formatted,
        ...history.filter((h) => h !== formatted),
      ].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("Places fetch failed", err);
    }
  };

  //Handle search from button click
  const handleSearch = () => {
    if (suggestions.length > 0) {
      fetchPlaces(suggestions[0]);
      setQuery(suggestions[0].properties.formatted);
      setSuggestions([]);
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
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
            console.log("User typing:", value); // DEBUG

            setQuery(value);
            if (value.length > 2) fetchSuggestions(value);
            else setSuggestions([]);
          }}
          onFocus={() => {
            if (!query) {
              setSuggestions(
                history.map((item) => ({ properties: { formatted: item } }))
              );
            }
          }}
        />

        {/* Search Button */}
        <button
          className="absolute right-0 top-0 h-full px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-r-lg transition-colors duration-200"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/*Suggestions */}
      {suggestions.length > 0 && (
        <ul className="bg-white mt-1 rounded shadow-md max-h-48 overflow-y-auto">
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              className="p-3 hover:bg-gray-100 text-gray-600 text-left cursor-pointer"
              onClick={() => {
                fetchPlaces(sug);
                setQuery(sug.properties.formatted);
                setSuggestions([]);
              }}
            >
              {sug.properties.formatted}
            </li>
          ))}
        </ul>
      )}

      {/* Search Results */}
      <div className="mt-6 space-y-4">
        {results.map((place, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 bg-white  shadow flex gap-4 items-start"
          >
            <div className="flex-1 ">
              <h2 className="text-lg text-gray-600 font-semibold">
                {place.properties.name || "Unnamed place"}
              </h2>
              <p className="text-gray-600">{place.properties.formatted}</p>
              <p className="text-sm text-gray-500 italic">
                Category: {place.properties.categories?.[0] || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchBar;
