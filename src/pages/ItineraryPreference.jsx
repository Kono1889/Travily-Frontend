import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowUpDown, History, X } from "lucide-react";
import mountains from "../assets/img/mountains.jpg";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContexts";
import config from "../config";

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
  const [destination, setDestination] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [numberOfDays, setNumberOfDays] = useState();
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Use AuthContext
  const { isAuthenticated, user, token, logout } = useAuth();

  const activitiesDropdownRef = useRef(null);

  // Fetch saved itineraries when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSavedItineraries();
    } else {
      setSavedItineraries([]);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isDropdownOpen &&
        activitiesDropdownRef.current &&
        !activitiesDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const fetchSavedItineraries = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        `${config.apiUrl}/api/itinerary/saved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedItineraries(response.data.itineraries || []);
    } catch (error) {
      console.error("Error fetching saved itineraries:", error);
      if (error.response?.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
      }
    }
  };

  const saveItinerary = async (itineraryData) => {
    try {
      if (!token) return;

      await axios.post(`$${config.apiUrl}/api/itinerary/save`, itineraryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Itinerary saved successfully!");
      fetchSavedItineraries();
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary");
    }
  };

  const deleteItinerary = async (itineraryId) => {
    try {
      if (!token) return;

      await axios.delete(
        `${config.apiUrl}/api/itinerary/delete/${itineraryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Itinerary deleted successfully!");
      fetchSavedItineraries();
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      toast.error("Failed to delete itinerary");
    }
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const isValidBudgetRange = (range) => {
    const regex = /^\s*\d+\s*-\s*\d+\s*$/;
    return regex.test(range);
  };

  const handleSubmit = async () => {
    if (!destination || !selectedActivities || !budgetRange || !numberOfDays) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isValidBudgetRange(budgetRange)) {
      toast.error("Please enter a valid budget range (e.g., 500-1000)");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `$${config.apiUrl}/api/insight/budget-insight`,
        {
          destination,
          activity: selectedActivities,
          budgetRange,
          numberOfDays,
        }
      );

      const generatedResponse = response.data.result;
      setAiResponse(generatedResponse);

      // Save itinerary if authenticated
      if (isAuthenticated && token) {
        const itineraryData = {
          destination,
          travelStyle: "Custom", // Since this component doesn't have travel style
          activities: selectedActivities,
          itinerary: generatedResponse,
          budgetRange,
          numberOfDays,
          safetyScore: safetyScore || "Not specified",
          tips: tipsSection || "",
          referenceLinks,
          createdAt: new Date().toISOString(),
        };
        await saveItinerary(itineraryData);
      }
    } catch (error) {
      console.error("Error generating travel plan:", error);
      setAiResponse("Failed to generate travel plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedItinerary = (itinerary) => {
    setDestination(itinerary.destination);
    setSelectedActivities(itinerary.activities);
    setBudgetRange(itinerary.budgetRange || "");
    setNumberOfDays(itinerary.numberOfDays || "");
    setAiResponse(itinerary.itinerary);
    setShowHistory(false);
    toast.success("Itinerary loaded successfully!");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Extract safety score and tips
  let safetyScore = null;
  let aiResponseWithoutSafety = aiResponse;
  let tipsSection = null;
  if (typeof aiResponse === "string") {
    const safetyMatch = aiResponse.match(
      /Safety Score\s*[:-]?\s*([0-9]+(\.[0-9]+)?(\s*\/\s*[0-9]+(\.[0-9]+)?)?)/i
    );
    if (safetyMatch) {
      safetyScore = safetyMatch[0];
      aiResponseWithoutSafety = aiResponse.replace(safetyMatch[0], "");
    }
    const tipsMatch = aiResponseWithoutSafety.match(
      /Tips to maximize value[\s\S]*/i
    );
    if (tipsMatch) {
      tipsSection = tipsMatch[0];
      aiResponseWithoutSafety = aiResponseWithoutSafety.replace(
        tipsMatch[0],
        ""
      );
    }
  }

  const daySections =
    typeof aiResponseWithoutSafety === "string"
      ? aiResponseWithoutSafety
          .split(/(?=Day\s+\d+)/i)
          .filter((section) => section.trim() !== "")
      : [];

  const referenceLinks =
    typeof aiResponse === "string"
      ? aiResponse.match(/https?:\/\/[^\s)]+/g) || []
      : [];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat pt-28 pb-10"
      style={{ backgroundImage: `url(${mountains})` }}
    >
      {/* Glass background wrapper */}
      <div className="bg-white/70 backdrop-blur-lg mx-auto max-w-6xl rounded-xl px-6 sm:px-10 py-16 shadow-xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold text-gray-800"
          >
            Budget on your terms
          </motion.h1>

          {/* View History Button - Show for authenticated non-anonymous users */}
          {isAuthenticated && !user?.isAnonymous && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-md"
            >
              <History className="h-4 w-4" />
              {showHistory ? "Back to Generator" : "View History"}
            </motion.button>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-center text-gray-600 mt-3"
        >
          Get insights based on your budget range
          {isAuthenticated && !user?.isAnonymous && (
            <span className="block text-sm text-green-600 mt-1">
              ✓ You are logged in as {user?.email} - your itineraries will be
              saved automatically
            </span>
          )}
          {isAuthenticated && user?.isAnonymous && (
            <span className="block text-sm text-yellow-600 mt-1">
              ⚠ You are in anonymous mode - Sign up to save your itineraries
              permanently
            </span>
          )}
        </motion.p>

        {showHistory ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Saved Itineraries
            </h2>
            {savedItineraries.length === 0 ? (
              <div className="text-center py-8 text-gray-600 bg-white/50 rounded-lg">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No saved itineraries yet.</p>
                <p className="text-sm">
                  Generate your first itinerary to see it here!
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {savedItineraries.map((itinerary, index) => (
                  <motion.div
                    key={itinerary._id || index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => loadSavedItinerary(itinerary)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {itinerary.destination}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {itinerary.travelStyle} •{" "}
                          {formatDate(itinerary.createdAt)}
                        </p>
                        {itinerary.budgetRange && (
                          <p className="text-gray-600 text-sm">
                            Budget: {itinerary.budgetRange}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadSavedItinerary(itinerary);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
                        >
                          Load
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItinerary(itinerary._id);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="mb-2">
                        <strong className="text-gray-800">Activities:</strong>{" "}
                        <span className="text-blue-600">
                          {itinerary.activities.join(", ")}
                        </span>
                      </p>
                      {itinerary.safetyScore &&
                        itinerary.safetyScore !== "Not specified" && (
                          <p className="mb-2">
                            <strong className="text-gray-800">
                              Safety Score:
                            </strong>{" "}
                            <span className="text-green-600 font-semibold">
                              {itinerary.safetyScore}
                            </span>
                          </p>
                        )}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {itinerary.itinerary.substring(0, 200)}...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Main Form */}
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
                  placeholder="Enter Travel Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Activities Multi-Select */}
              <div className="relative w-full" ref={activitiesDropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer py-3 px-4 border border-gray-300 rounded-lg bg-white flex justify-between items-center hover:border-gray-400 transition"
                >
                  <span className="truncate text-gray-700">
                    {selectedActivities.length > 0
                      ? `${selectedActivities.length} selected`
                      : "Select Activities"}
                  </span>
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>

                {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {activities.map((activity) => (
                      <li
                        key={activity}
                        onClick={() => handleActivitySelect(activity)}
                        className={`px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                          selectedActivities.includes(activity)
                            ? "bg-blue-100 font-semibold text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                              selectedActivities.includes(activity)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-400"
                            }`}
                          >
                            {selectedActivities.includes(activity) && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </div>
                          {activity}
                        </div>
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
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Number Of Days */}
              <div className="relative w-full">
                <input
                  type="text"
                  min="1"
                  placeholder="Number of Days"
                  value={numberOfDays || ""}
                  onChange={(e) =>
                    setNumberOfDays(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <div className="flex justify-center items-center w-full mt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                disabled={loading}
                onClick={handleSubmit}
                className={`${
                  loading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white font-semibold w-full max-w-[420px] px-8 py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl`}
              >
                {loading ? "Generating..." : "Get Insights"}
              </motion.button>
            </div>

            {/* Results Display */}
            {safetyScore && (
              <div className="mt-8 mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow flex items-center">
                <span className="font-bold text-yellow-700 mr-2">
                  {safetyScore}
                </span>
                <span className="text-gray-700">
                  (for your selected destination)
                </span>
              </div>
            )}

            {tipsSection && (
              <div className="mt-8 mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded shadow">
                <span className="font-bold text-green-700 block mb-2">
                  Tips to maximize value
                </span>
                <span className="text-gray-800 whitespace-pre-line">
                  {tipsSection.replace(/Tips to maximize value:?/i, "").trim()}
                </span>
              </div>
            )}

            {daySections.length > 0 && (
              <div className="mt-10 space-y-4">
                {daySections.map((section, index) => {
                  const bgColors = [
                    "bg-orange-100 border-orange-300",
                    "bg-blue-100 border-blue-300",
                    "bg-green-100 border-green-300",
                  ];
                  const colorClass = bgColors[index % bgColors.length];

                  const sectionWithoutLinks = section.replace(
                    /https?:\/\/[^\s)]+/g,
                    ""
                  );

                  const formattedSection = sectionWithoutLinks
                    .split("\n")
                    .map((line) => line.replace(/^\*+\s?/, "• "))
                    .filter((line) => line.trim() !== "•" && line.trim() !== "")
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

            {referenceLinks.length > 0 && (
              <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Reference Links:
                </h3>
                <ul className="list-disc pl-5">
                  {referenceLinks.map((link, idx) => (
                    <li key={idx} className="mb-1">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItineraryPreference;
