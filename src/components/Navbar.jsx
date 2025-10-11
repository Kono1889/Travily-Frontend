import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";
import { LogOut, Mail, LogIn, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContexts";
import AuthModal from "./AuthModal";
import SignBanner from "./SignBanner";
import UserAvatar from "./UserAvatar"; // Import from separate file

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showMobileAuthMenu, setShowMobileAuthMenu] = useState(false);
  const dropdownRef = useRef(null);
  const mobileAuthRef = useRef(null);

  const { user, isAuthenticated, isAnonymous, logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileAuthRef.current && !mobileAuthRef.current.contains(e.target)) {
        setShowMobileAuthMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setShowMobileAuthMenu(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md p-4 fixed max-w-full z-50 top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto lg:mx-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <div className="text-2xl font-bold text-blue-900">Travily</div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 font-semibold text-gray-700 items-center">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/news" className="hover:text-blue-600 transition">
              News
            </Link>
            <a href="#contact" className="hover:text-blue-600 transition">
              Contact
            </a>

            {/* User profile / auth */}
            {isAuthenticated && !isAnonymous ? (
              <div className="relative" ref={dropdownRef}>
                <UserAvatar 
                  user={user}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />

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
                        onClick={handleLogout}
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
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Sign In
              </button>
            )}
            <div className="absolute top-20 right-0">
              <SignBanner />
            </div>
          </div>

          {/* Mobile Authentication & Menu */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Auth Button */}
            {isAnonymous ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition font-semibold flex items-center gap-2 text-sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            ) : (
              <div className="relative" ref={mobileAuthRef}>
                <div className="flex items-center gap-2">
                  <UserAvatar 
                    user={user}
                    onClick={() => setShowMobileAuthMenu(!showMobileAuthMenu)}
                  />
                  
                </div>

                {/* Mobile Auth Dropdown */}
                <AnimatePresence>
                  {showMobileAuthMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 transition text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button 
              className="relative z-10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="space-y-1">
                <span className={`block w-6 h-0.5 bg-black transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-black ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-black transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              setMenuOpen={setMenuOpen}
              openAuthModal={() => setIsAuthModalOpen(true)}
              isAuthenticated={isAuthenticated}
              isAnonymous={isAnonymous}
              user={user}
              onLogout={handleLogout}
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