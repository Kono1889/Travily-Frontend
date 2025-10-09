import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { motion } from "framer-motion";

const SignBanner = () => {
  const { isAnonymous, user, loading } = useAuth();
  const [showBanner, setShowBanner] = useState(true);
  const [showWelcomeBan, setShowWelcomeBan] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const timeoutRef = useRef(null);

  // Check if device is desktop
  useEffect(() => {
    const checkDevice = () => setIsDesktop(window.innerWidth >= 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => {
      window.removeEventListener("resize", checkDevice);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Typing animation for authenticated users
  useEffect(() => {
    if (!isAnonymous && user && showWelcomeBan) {
      const welcomeText = `Welcome back, ${user.username || 'Traveler'}! `;
      if (currentIndex < welcomeText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(prev => prev + welcomeText[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 100);
      }
    } else {
      setDisplayedText("");
      setCurrentIndex(0);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isAnonymous, user, showWelcomeBan]);

  // Don't show on mobile or during loading
  if (loading || !isDesktop) return null;

  // Your exact condition for welcome message
  if (!isAnonymous && user && showWelcomeBan) {
    return (
      <motion.div
        className="w-70 bg-white rounded-lg p-4 border border-blue-200 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="font-medium text-blue-800">
              {displayedText}
              {currentIndex > 0 && <span className="ml-1 animate-pulse">|</span>}
            </div>
          </div>
          <button
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            onClick={() => setShowWelcomeBan(false)}
            aria-label="Close welcome banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Show sign-in banner for anonymous users
  if (isAnonymous && showBanner) {
    return (
      <motion.div
        className="w-70 bg-white rounded-lg p-4 border border-blue-200 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Sign in to save your search history and get personalized recommendations!
            </p>
          </div>
          <button
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            onClick={() => setShowBanner(false)}
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default SignBanner;