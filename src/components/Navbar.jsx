import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom"; // use react-router-dom
import { LogOut, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContexts";
import AuthModal from "./AuthModal"; // import modal

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, isAnonymous, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <>
      <nav className="bg-white shadow-md p-4 fixed max-w-full z-100 top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto lg:mx-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <div className="text-2xl font-bold text-blue-900">Travily</div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 font-semibold text-gray-700 items-center">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/news" className="hover:text-blue-600 transition">News</Link>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>

            {/* User profile / auth */}
            {isAuthenticated && !isAnonymous ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold hover:bg-blue-600 transition"
                >
                  {getUserInitial()}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user?.username || "User"}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" />
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)} // 👈 open modal
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu 
              setMenuOpen={setMenuOpen}
              openAuthModal={() => setIsAuthModalOpen(true)} // 👈 pass modal trigger
            />
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
