import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import mountains from "../assets/img/mountains.jpg";

const ItineraryPreference = () => {
  const activities = [
    "Art & Entertainment",
    "Hiking & Nature",
    "Beach & Relaxation",
    "Food & Culinary",
    "History & Culture",
    "Shopping",
  ];

  const [selectedActivities, setSelectedActivities] = useState([]);
  const handleActivitySelect = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const activitiesRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isDropdownOpen &&
        activitiesRef.current &&
        !activitiesRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const [destination, setDestination] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [numberOfDays, setNumberOfDays] = useState();
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const formatted =
    typeof aiResponse === "string"
      ? aiResponse
          .split("\n")
          .map((line) => (line ? line.replace(/^\*\s?/, "• ") : ""))
          .join("\n")
      : "";

  const isValidBudgetRange = (range) => {
    const regex = /^\s*\d+\s*-\s*\d+\s*$/;
    return regex.test(range);
  };

  const handleSubmit = async () => {
    if (!destination || !selectedActivities || !budgetRange || !numberOfDays) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidBudgetRange(budgetRange)) {
      alert("Please enter a valid budget range (e.g., 500-1000)");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/insight/budget-insight",
        {
          destination,
          activity: selectedActivities,
          budgetRange,
          numberOfDays,
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
          Budget on your terms
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-center text-gray-600 mt-3"
        >
          Get insights based on your budget range
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Destination Input */}
          <div className="relative w-full" ref={activitiesRef}>
            <input
              type="text"
              placeholder="Enter Travel Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Activities Multi-Select */}
          <div className="relative w-full">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer py-2 px-4 border border-gray-300 rounded-lg bg-white flex justify-between items-center"
            >
              <span className="truncate text-gray-700">
                {selectedActivities.length > 0
                  ? selectedActivities.join(", ")
                  : "Select Activities"}
              </span>
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>

            {isDropdownOpen && (
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

          {/* Budget Range Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Budget Range (e.g., 500-1000)"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Number Of Days */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Number of Days"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
        </motion.div>

        <div className="flex justify-center items-center w-full mt-6">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.02 }}
            disabled={loading}
            onClick={handleSubmit}
            className={`${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }bg-orange-400 text-white font-semibold w-full max-w-[420px] px-8 py-2 hover:shadow-lg hover:cursor-pointer hover:opacity-90 transition whitespace-nowrap rounded text-center`}
          >
            {loading ? "Generating..." : "Get Insights"}
          </motion.button>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="mt-10 p-6 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Your Budget Plan:
            </h3>
            <p className="whitespace-pre-line text-gray-700">
              {formatted.replace(/\*+/g, "")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryPreference;
