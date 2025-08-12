// components/NewsCard.jsx
const NewsCard = ({ title, imageUrl, source, url }) => {
  return (
    <div className="rounded shadow-lg bg-white p-2 hover:bg-gray-100 transition">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover mb-3 rounded"
        />
      )}
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{source}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 text-sm font-semibold mt-2 inline-block hover:underline"
      >
        Read more →
      </a>
    </div>
  );
};

export default NewsCard;
