// pages/News.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import config from "../config";

const News = () => {
  const [groupedNews, setGroupedNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/api/news/popular`);
        setGroupedNews(res.data); // Already grouped by backend
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

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
