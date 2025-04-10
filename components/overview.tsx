import { motion } from "framer-motion";
import Link from "next/link";

import { Sun, Globe } from "lucide-react"; // Icons for weather and geospatial themes

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <Sun size={32} /> {/* Weather-related icon */}
          <span>+</span>
          <Globe size={32} /> {/* Geospatial-related icon */}
        </p>
        <p>
          Welcome to <strong>SpatialGPT</strong>, your conversational assistant
          for exploring and understanding weather patterns, forecasts, and
          climate trends. Powered by the{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://open-meteo.com/"
            target="_blank"
          >
            Open-Meteo API
          </Link>
          and geolocation data, SpatialGPT combines natural language interaction
          with map-based exploration.
        </p>
      </div>
    </motion.div>
  );
};
