import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import "../index.css";
import axios from "axios";
import mountains from "../assets/img/mountains.jpg";
import toast from "react-hot-toast";

// const bgImageUrl =
//   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"; // Beach sample

const Budget = () => {
  // const countries = [
  //   "France",
  //   "Japan",
  //   "USA",
  //   "Italy",
  //   "Thailand",
  //   "Australia",
  // ];
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const travelRef = useRef(null);
  const activitiesRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isDropdownOpen === "travel" &&
        travelRef.current &&
        !travelRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(null);
      }
      if (
        isDropdownOpen === "activities" &&
        activitiesRef.current &&
        !activitiesRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // const formatted =
  //   typeof aiResponse === "string"
  //     ? aiResponse
  //         .split("\n")
  //         .map((line) => line?.replace(/^\*\s?/, "• "))
  //         .join("\n")
  //     : "";

  const daySections =
    typeof aiResponse === "string"
      ? aiResponse
          .split(/(?=Day\s+\d+)/i) // split whenever "Day X" starts
          .filter((section) => section.trim() !== "")
      : [];

  const handleActivitySelect = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = async () => {
    if (!destination || !travelStyle || selectedActivities.length === 0) {
      toast.error(
        "Please select a destination, style, and at least one activity."
      );
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
      setAiResponse(response.data.result);
    } catch (error) {
      console.error("Error generating travel plan:", error);
      setAiResponse("Failed to generate travel plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat pt-28 pb-10"
      style={{ backgroundImage: `url(${mountains})` }}
    >
      {/* Glass background wrapper */}
      <div className="bg-white/70 backdrop-blur-lg mx-auto max-w-6xl rounded-xl px-6 sm:px-10 py-16 shadow-xl">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-extrabold text-center text-gray-800"
        >
          Budget Your Trip
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-center text-gray-600 mt-3"
        >
          Get personalized budgeting based on your destination and travel style.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Destination Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Travel Style Select */}
          <div className="relative w-full" ref={travelRef}>
            <div
              onClick={() => setIsDropdownOpen("travel")}
              className="cursor-pointer py-2 px-4 border border-gray-300 rounded-lg bg-white flex justify-between items-center"
            >
              <span className="truncate text-gray-700">
                {travelStyle || "Select Travel Style"}
              </span>
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>

            {isDropdownOpen === "travel" && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto">
                {travelStyles.map((style) => (
                  <li
                    key={style}
                    onClick={() => {
                      setTravelStyle(style);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                      travelStyle === style ? "bg-blue-200 font-semibold" : ""
                    }`}
                  >
                    {style}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activities Multi-Select */}
          <div className="relative w-full" ref={activitiesRef}>
            <div
              onClick={() =>
                setIsDropdownOpen(
                  isDropdownOpen === "activities" ? null : "activities"
                )
              }
              className="cursor-pointer py-2 px-4 border border-gray-300 rounded-lg bg-white flex justify-between items-center"
            >
              <span className="truncate text-gray-700">
                {selectedActivities.length > 0
                  ? selectedActivities.join(", ")
                  : "Select Activities"}
              </span>
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>

            {isDropdownOpen === "activities" && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto">
                {activities.map((activity) => (
                  <li
                    key={activity}
                    onClick={() => handleActivitySelect(activity)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                      selectedActivities.includes(activity)
                        ? "bg-blue-200 font-semibold"
                        : ""
                    }`}
                  >
                    {activity}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.02 }}
            disabled={loading}
            onClick={handleSubmit}
            className={`${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white font-semibold px-8 py-2 rounded transition duration-200 shadow-md`}
          >
            {loading ? "Generating..." : "Get Budget"}
          </motion.button>
        </motion.div>

        {/* AI Response */}
        {/* {aiResponse && (
          <div className="mt-10 p-6 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Your Budget Plan:
            </h3>
            <p className="whitespace-pre-line text-gray-700">
              {formatted.replace(/\*+/g, "")}
            </p>
          </div>
        )} */}

        {daySections.length > 0 && (
          <div className="mt-10 space-y-4">
            {daySections.map((section, index) => {
              const bgColors = [
                "bg-orange-100 border-orange-300",
                "bg-blue-100 border-blue-300",
                "bg-green-100 border-green-300",
              ];
              const colorClass = bgColors[index % bgColors.length];

              // Add bullet formatting to lines starting with *
              const formattedSection = section
                .split("\n")
                .map((line) => line.replace(/^\*\s?/, "• "))
                .join("\n");

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow border ${colorClass}`}
                >
                  <p className="whitespace-pre-line text-gray-800">
                    {formattedSection.trim().replace(/\*+/g, "")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
