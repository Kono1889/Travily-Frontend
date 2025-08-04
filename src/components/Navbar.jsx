import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 fixed max-w-full z-20 top-0 left-0 right-0">
      <div className="max-w-7xl mx-auto lg:mx-20 flex justify-between items-center">
        <Link to="/">
          <div className="text-2xl font-bold text-blue-900">Travily</div>
        </Link>
        <div className="hidden md:flex gap-4 font-semibold text-gray-700">
          <Link to="/">
            <div className="hover:text-blue-600 transition">Home</div>
          </Link>
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#contact" className="hover:text-blue-600 transition">
            Contact
          </a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && <MobileMenu setMenuOpen={setMenuOpen} />}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
