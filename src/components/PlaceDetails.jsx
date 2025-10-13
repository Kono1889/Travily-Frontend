import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import config from "../config";

const PlaceDetails = () => {
  const { name } = useParams();
  const location = useLocation();
  const { lat, lon } = location.state || {};
  const [places, setPlaces] = useState([]);
  const [histories, setHistories] = useState({});
  const [images, setImages] = useState({});
  const [urls, setUrls] = useState({});
  const [loading, setLoading] = useState(true); // ⬅️ Spinner state

  useEffect(() => {
    const fetchData = async () => {
      if (!lat || !lon) return;

      try {
        const res = await axios.get(
          `${config.apiUrl}/api/geoapify/places?lat=${lat}&lon=${lon}&category=tourism.sights&radius=5000`
        );

        const allPlaces = res.data.features || [];
        const landmarks = allPlaces.filter(
          (place) =>
            place.properties.name && place.properties.name.trim() !== ""
        );
        setPlaces(landmarks);

        const imagePromises = [];
        const historyPromises = [];

        landmarks.forEach((place) => {
          const name = place.properties.name || "";
          imagePromises.push(fetchImageFromUnsplash(name));
          historyPromises.push(fetchPlaceHistory(name));
        });

        const imagesResult = await Promise.all(imagePromises);
        const historyResult = await Promise.all(historyPromises);

        const imgMap = {};
        const historyMap = {};
        const urlMap = {};

        landmarks.forEach((place, idx) => {
          const name = place.properties.name || "";
          imgMap[name] = imagesResult[idx];
          historyMap[name] = historyResult[idx].text;
          urlMap[name] = historyResult[idx].url;
        });

        setImages(imgMap);
        setHistories(historyMap);
        setUrls(urlMap);
      } catch (err) {
        console.error("Error fetching places, images, or histories:", err);
      } finally {
        setLoading(false); // Hide spinner
      }
    };

    fetchData();
  }, [lat, lon]);

  const fetchPlaceHistory = async (placeName) => {
    if (!placeName)
      return { text: "No history available.", image: null, url: null };

    try {
      const res = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          placeName
        )}`
      );

      return {
        text: res.data.extract || "No history available.",
        image: res.data.thumbnail?.source || null,
        url: res.data.content_urls?.desktop?.page || null,
      };
    } catch {
      return { text: "No history available.", image: null, url: null };
    }
  };

  const fetchImageFromUnsplash = async (query) => {
    try {
      const res = await axios.get(`${config.apiUrl}/api/unsplash/image`, {
        params: { query },
      });
      return res.data.image || null;
    } catch (err) {
      console.error("Unsplash image fetch error:", err);
      return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        {decodeURIComponent(name)}
      </h1>
      <p className="text-gray-500 mb-8">
        Tourist attractions and landmarks near this location:
      </p>

      {/* Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <ClipLoader size={40} color="#F97316" />
        </div>
      ) : (
        <div className="space-y-6">
          {places.map((place, idx) => {
            const placeName = place.properties.name || "Unnamed";
            return (
              <div key={idx} className=" p-4 rounded-lg bg-white shadow-lg ">
                <h2 className="text-xl font-semibold text-gray-700">
                  {placeName}
                </h2>
                <p className="text-gray-600">{place.properties.formatted}</p>
                <p className="text-sm italic text-gray-500 mt-1">
                  Category: {place.properties.categories?.[0] || "N/A"}
                </p>

                <img
                  src={images[placeName] || "/fallback.jpg"}
                  alt={placeName}
                  className="mt-4 w-full h-48 object-cover rounded"
                />

                {histories[placeName] && (
                  <p className="mt-3 text-gray-700 text-sm">
                    {histories[placeName]}
                    {urls[placeName] && (
                      <a
                        href={urls[placeName]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 ml-2 font-bold hover:underline"
                      >
                        Read more
                      </a>
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;
