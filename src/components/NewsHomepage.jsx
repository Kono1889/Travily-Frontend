// pages/NewsHomepage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import config from "../config";

const NewsHomepage = () => {
  const [popularNews, setPopularNews] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get("/api/news/popular");
        console.log(await fetch(`${config.apiUrl}/api/health`).then(r => r.json()));

        setPopularNews(res.data.slice(0, 6)); // Show top 6
      } catch (err) {
        console.error("Popular news fetch error:", err);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6"> Popular News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {popularNews.map((article, idx) => (
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
  );
};

export default NewsHomepage;
