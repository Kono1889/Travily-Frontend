import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import "../index.css";
import axios from "axios"; // or use fetch

const Budget = () => {
  const countries = [
    "France",
    "Japan",
    "USA",
    "Italy",
    "Thailand",
    "Australia",
  ];
  const travelStyles = [
    "Backpacking",
    "Luxury",
    "Family",
    "Business",
    "Adventure",
    "Solo",
  ];
  const activities = [
    "Art & Entertainment",
    "Hiking & Nature",
    "Beach & Relaxation",
    "Food & Culinary",
    "History & Culture",
    "Shopping",
  ];

  const [destination, setDestination] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const formatted =
    typeof aiResponse === "string"
      ? aiResponse
          .split("\n")
          .map((line) => (line ? line.replace(/^\*\s?/, "• ") : ""))
          .join("\n")
      : "";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleActivitySelect = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleSubmit = async () => {
    if (!destination || !travelStyle || selectedActivities.length === 0) {
      alert("Please select all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/itinerary/generate",
        {
          destination,
          travelStyle,
          selectedActivities,
        }
      );

      setAiResponse(response.data.result); // Updated to match new response from Groq
    } catch (error) {
      console.error("Error generating travel plan:", error);
      setAiResponse("Failed to generate travel plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 mb-6 lg:mx-20">
      <div className="rounded-xl bg-gradient-to-r mx-20 from-blue-500 py-20 to-green-400 text-white px-4 sm:px-6 lg:px-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{ delay: 0.3 }}
          className="text-3xl pb-4 text-center font-bold text-gray-200"
        >
          Budget Your Trip
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold text-center"
        >
          Get an overview of your destination
        </motion.p>

        <motion.div
          className="flex flex-col lg:flex-row gap-6 pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{ delay: 0.7 }}
        >
          {/* Destination Select */}
          <div className="relative flex items-center shadow-lg w-full">
            <input
              type="text"
              placeholder="Travel Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-6 pr-6 py-2 border border-gray-300 bg-white opacity-50 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            />

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Travel Style Select */}
          <div className="relative flex items-center shadow-lg w-full">
            <select
              className="w-full pl-6 pr-10 py-2 border border-gray-300 bg-white opacity-50 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent appearance-none"
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
            >
              <option value="" disabled>
                Travel Style
              </option>
              {travelStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Multi-Select Activities */}
          <div className="relative w-full shadow-lg">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full pl-6 pr-3 py-2 border border-gray-300 bg-white opacity-50 text-black font-semibold cursor-pointer"
            >
              <span className="truncate">
                {selectedActivities.length > 0
                  ? selectedActivities.join(", ")
                  : "Select Travel Activities"}
              </span>
              <ArrowUpDown className="w-5 h-5 text-gray-400" />
            </div>

            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-md max-h-48 overflow-auto rounded">
                {activities.map((activity) => (
                  <li
                    key={activity}
                    onClick={() => handleActivitySelect(activity)}
                    className={`px-4 py-2 cursor-pointer text-black hover:bg-blue-100 ${
                      selectedActivities.includes(activity) ? "bg-blue-200" : ""
                    }`}
                  >
                    {activity}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-white text-gray-600 font-semibold px-8 py-2 hover:shadow-lg hover:cursor-pointer hover:opacity-90 transition whitespace-nowrap"
          >
            {loading ? "Generating..." : "Get Budget"}
          </button>
        </motion.div>

        {aiResponse && (
          <div className="response-box mt-10 p-6 bg-white text-black rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Your Budget Plan:</h3>
            <p className="text-wrap">{formatted.replace(/\*+/g, "")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
