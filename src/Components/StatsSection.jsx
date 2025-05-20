import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const controls = useAnimation();
  const [counts, setCounts] = useState({ resumes: 0, hired: 0 });

  useEffect(() => {
    if (isInView) {
      const duration = 5000;
      const start = performance.now();

      const animateCount = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        setCounts({
          resumes: Math.floor(12000 * progress),
          hired: Math.floor(3000 * progress),
        });
        if (progress < 1) requestAnimationFrame(animateCount);
      };

      requestAnimationFrame(animateCount);
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView]);

  return (
    <section className="bg-sky-800/10  px-5 py-5 md:py-20 text-center relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-300 opacity-20 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-green-300 opacity-10 blur-3xl rounded-full z-0" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <h2 className="text-lg md:text-2xl mb-6 text-[#0f172a] [font-family:'Lilita_One',cursive]">
          Helping Careers Take Off 🚀
        </h2>
        <p className="text-base md:text-xl font-medium text-gray-800">
          More than{" "}
          <span className="text-[#1271ba] font-bold text-lg md:text-3xl tabular-nums">
            {counts.resumes.toLocaleString()}+
          </span>{" "}
          resumes built,{" "}
          <span className="text-green-600 font-bold text-lg tmd:ext-3xl tabular-nums">
            {counts.hired.toLocaleString()}+
          </span>{" "}
          users hired!
        </p>
      </motion.div>
    </section>
  );
};

export default StatsSection;
