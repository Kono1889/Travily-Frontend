import { motion } from "framer-motion";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="relative flex items-center shadow-lg">
          {/* Search Icon (Left) */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search hotels, destinations or places..."
            className="w-full pl-10 pr-24 py-4 border border-gray-300 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          />

          {/* Search Button (Right) */}
          <button className="absolute right-0 top-0 h-full px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-r-lg transition-colors duration-200">
            Search
          </button>
        </div>
      </motion.div>
  );
};

export default SearchBar;
