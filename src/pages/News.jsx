// pages/News.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import config from "../config";

const News = () => {
  const [groupedNews, setGroupedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/api/news/popular`);
        setGroupedNews(res.data); // Already grouped by backend
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mb-3"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading news worldwide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-8">
        Global News by Country
      </h1>

      {groupedNews.map(({ country, news }) => (
        <div key={country} className="mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 uppercase">
            {country}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {news.slice(0, 6).map((article, idx) => (
              <NewsCard
                key={idx}
                title={article.title}
                imageUrl={article.image_url}
                source={article.source_id}
                url={article.link}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default News;
