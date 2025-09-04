import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegClock, FaStar } from "react-icons/fa";
import { WiStars } from "react-icons/wi";

export default function Templates() {
  const navigate = useNavigate();

  const Template = [
    {
      id: 1,
      name: "Sidebar Template",
      image: "/sidebar.jpg",
      description: "A clean and modern template for a professional look.",
      badge: "Popular",
      badgeColor: "bg-gradient-to-r from-sky-500 to-cyan-400",
    },
    {
      id: 2,
      name: "Classic Template",
      image: "/classic.jpg",
      description: "A classic design that is timeless and effective.",
      badge: "Timeless",
      badgeColor: "bg-gradient-to-r from-green-500 to-emerald-400",
    },
    {
      id: 3,
      name: "Standard Template",
      image: "/standard.jpg",
      description: "A Standard layout that stands out from the crowd.",
      badge: "Standard",
      badgeColor: "bg-gradient-to-r from-blue-500 to-pink-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col pt-10 py-5 pb-14 md:py-10 md:pb-32 items-center justify-center min-h-[60vh] text-center p-6 bg-gradient-to-br from-white via-sky-50 to-white "
    >
      <div className="py-7">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-1.5 mb-3 shadow-lg">
          <FaStar className="text-yellow-500 text-xs" />
          <span className="text-[10px] md:text-xs font-medium text-slate-700">
            Resume Templates
          </span>
        </div>

        <h1 className="text-2xl  md:text-4xl font-bold text-gray-800 mb-4">
          Choose Your Perfect Resume Template
        </h1>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 md:px-20">
        {Template.map((temp, index) => (
          <motion.div
            key={temp.id}
            initial={{ opacity: 0, y: 40 }}
            whileHover={{ scale: 1.03 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            className="group relative bg-white/80 rounded-md backdrop-blur-sm border border-white/20  shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            {/* Badge */}
            <div
              className={`absolute top-4 right-4 ${temp.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10`}
            >
              {temp.badge}
            </div>

            {/* Template Image */}
            <div className="relative overflow-hidden rounded-md mb-4 group-hover:transform transition-transform duration-500">
              {" "}
              <img
                src={temp.image}
                alt={temp.name}
                className="w-full h-72 md:h-96 relative object-cover"
                loading="lazy"
              />
              <motion.button
                type="button"
                aria-label={`Try the ${temp.name} template`}
                onClick={() => navigate("/resume")}
                whileTap={{ scale: 0.98 }}
                className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-700 shadow-lg hover:shadow-xl text-white font-semibold text-base transition-all duration-300 cursor-pointer"
              >
                <WiStars className="text-sm md:text-xl" />
                <span className="text-sm md:text-base">Try This</span>
              </motion.button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />{" "}
            </div>

            <div className="space-y-2 p-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                {temp.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {temp.description}
              </p>
            </div>

            {/* Decorative Elements */}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
