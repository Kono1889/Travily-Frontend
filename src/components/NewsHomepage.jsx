// pages/NewsHomepage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import config from "../config";

const NewsHomepage = () => {
  const [popularNews, setPopularNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/api/news/popular`);
        const allArticles = res.data.flatMap((group) => group.news);
        const randomNews = allArticles
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        setPopularNews(randomNews);
      } catch (err) {
        console.error("Popular news fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
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
          <p className="text-gray-600 text-sm md:text-base">
            Loading latest news...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
        Popular News
      </h1>

      {popularNews.length === 0 ? (
        <p className="text-gray-500 text-center text-sm md:text-base">
          No news available at the moment.
        </p>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-3 
            gap-8
            w-full
          "
        >
          {popularNews.map((article, idx) => (
            <div key={idx} className="flex justify-center">
              <NewsCard
                title={article.title}
                imageUrl={article.image_url}
                source={article.source_id}
                url={article.link}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsHomepage;
