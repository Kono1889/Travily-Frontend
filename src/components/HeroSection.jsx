import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import vid1 from "../assets/vid/189819-887078801_tiny.mp4"

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden rounded-b-[100px] text-white"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={vid1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (optional, for better text readability) */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="flex flex-col items-center justify-center text-center pt-32 pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Let's Make Your Dream Vacation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-xl mb-12"
          >
            Personalized itineraries, sightseeing clusters, and cost estimation
            all in one place.
          </motion.p>

          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
