import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const controls = useAnimation();
  const [counts, setCounts] = useState({ resumes: 0, hired: 0 });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
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
  }, [isInView, controls]);

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 lg:px-20 bg-sky-100 text-center">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-center gap-11"
      >
        <div className="flex justify-center items-center ">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 ">
            Helping Careers Take Off 🚀
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-sky-600 mb-2 tabular-nums">
              {counts.resumes.toLocaleString()}+
            </div>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              Resumes Created
            </p>
          </div>

          <div className="hidden sm:block w-px h-12 bg-gray-300"></div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-sky-600 mb-2 tabular-nums">
              {counts.hired.toLocaleString()}+
            </div>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              Users Hired
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;
