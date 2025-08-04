import { useState } from "react";

const CitySearch = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("tourism.sights");

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city.trim(), category);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Search Places</h2>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city name"
          className="border rounded px-4 py-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="tourism.sights">Tourist Attractions</option>
        <option value="catering.restaurant">Restaurants</option>
        <option value="entertainment.museum">Museums</option>
        <option value="leisure.park">Parks</option>
        <option value="accommodation.hotel">Hotels</option>
      </select>
    </div>
  );
};

export default CitySearch;
