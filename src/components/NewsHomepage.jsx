import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";

const NewsHomepage = () => {
  const [groupedNews, setGroupedNews] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get("/api/news/popular");
        setGroupedNews(res.data);  
      } catch (err) {
        console.error("Popular news fetch error:", err);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Popular News by Country</h1>

      {groupedNews.map(({ country, news }) => (
        <div key={country} className="mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">{country}</h2>
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

export default NewsHomepage;
