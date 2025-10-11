// MobileMenu.jsx (updated)
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, User, LogOut, LogIn } from "lucide-react";

const MobileMenu = ({ setMenuOpen, openAuthModal, isAuthenticated, isAnonymous, user, onLogout }) => {
  const handleAuthClick = () => {
    if (isAuthenticated && !isAnonymous) {
      onLogout();
    } else {
      openAuthModal();
    }
    setMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="fixed inset-0 bg-white z-40 pt-20 px-6"
    >
      {/* Close Button */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-4 right-4 p-2"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Links */}
      <div className="flex flex-col gap-6 text-lg font-semibold mb-8">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="py-3 border-b border-gray-100"
        >
          Home
        </Link>
        <Link
          to="/news"
          onClick={() => setMenuOpen(false)}
          className="py-3 border-b border-gray-100"
        >
          News
        </Link>
        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="py-3 border-b border-gray-100"
        >
          Contact
        </a>
      </div>

      {/* Authentication Section */}
      <div className="border-t border-gray-200 pt-6">
        {isAuthenticated && !isAnonymous ? (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.username || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleAuthClick}
              className="w-full flex items-center gap-3 py-3 px-4 text-red-600 bg-red-50 rounded-lg font-semibold"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        ) : (
          // Sign In Button for anonymous users
          <button
            onClick={handleAuthClick}
            className="w-full flex items-center gap-3 py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold"
          >
            <LogIn className="h-5 w-5" />
            Sign In to Save Searches
          </button>
        )}
      </div>

      {/* App Info */}
      <div className="absolute bottom-6 left-6 right-6">
        <p className="text-sm text-gray-500 text-center">
          Your travel companion
        </p>
      </div>
    </motion.div>
  );
};

export default MobileMenu;