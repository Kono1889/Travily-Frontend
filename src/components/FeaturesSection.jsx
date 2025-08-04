import { motion } from "framer-motion";
import { Link } from "react-router";


const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 px-4 grid gap-8 md:grid-cols-3">
      <Link to="/cluster">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl hover:cursor-pointer transition ease-in"
        >
          <h3 className="font-bold text-lg mb-2">Smart Clustering</h3>
          <p>
            Group tourist sites by proximity to maximize sightseeing efficiency.
          </p>
        </motion.div>
      </Link>
      <Link to="budget">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl hover:cursor-pointer transition ease-in"
        >
          <h3 className="font-bold text-lg mb-2">Cost Estimation</h3>
          <p>
            Get insights into living costs, activity prices, and budget
            recommendations.
          </p>
        </motion.div>
      </Link>
      <Link to='itineraryPreference'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl hover:cursor-pointer transition ease-in"
        >
          <h3 className="font-bold text-lg mb-2">User Preferences</h3>
          <p>
            Customize itineraries based on your preferred activities and budget
            range.
          </p>
        </motion.div>
      </Link>
    </section>
  );
};

export default FeaturesSection;
