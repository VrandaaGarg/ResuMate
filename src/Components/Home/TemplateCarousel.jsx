import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const templates = [
  {
    id: 1,
    name: "Sidebar Template",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157828/sidebar_hduvee.jpg",
    description: "A clean and modern template for a professional look.",
    badge: "Popular",
    badgeColor: "bg-gradient-to-r from-sky-500 to-cyan-400",
    users: "2,500,000+ users chose this template",
  },
  {
    id: 2,
    name: "Classic Template",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157768/classic_fjq31b.jpg",
    description: "A classic design that is timeless and effective.",
    badge: "Timeless",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-400",
    users: "1,800,000+ users chose this template",
  },
  {
    id: 3,
    name: "Standard Template",
    image:
      "https://res.cloudinary.com/dyetf2h9n/image/upload/v1757157832/standard_vjm4w9.jpg",
    description: "A Standard layout that stands out from the crowd.",
    badge: "Standard",
    badgeColor: "bg-gradient-to-r from-blue-500 to-pink-400",
    users: "1,200,000+ users chose this template",
  },
];

const TemplateCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
  });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const animationTimeoutRef = useRef(null);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % templates.length);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const getTemplatePosition = useCallback(
    (index) => {
      const diff = (index - currentIndex + templates.length) % templates.length;
      if (diff === 0) return "center";
      if (diff === 1 || diff === -(templates.length - 1)) return "right";
      return "left";
    },
    [currentIndex]
  );

  const getTemplateStyle = useCallback(
    (position, isMobile = false, isTablet = false) => {
      const baseScale = isMobile ? 0.7 : isTablet ? 0.85 : 1;
      const sideScale = isMobile ? 0.5 : isTablet ? 0.7 : 0.85;
      const xOffset = isMobile ? 120 : isTablet ? 160 : 200;

      switch (position) {
        case "center":
          return {
            scale: baseScale,
            x: 0,
            zIndex: 3,
            opacity: 1,
          };
        case "left":
          return {
            scale: sideScale,
            x: -xOffset,
            zIndex: 1,
            opacity: isMobile ? 0.7 : 0.8,
          };
        case "right":
          return {
            scale: sideScale,
            x: xOffset,
            zIndex: 1,
            opacity: isMobile ? 0.7 : 0.8,
          };
        default:
          return {
            scale: 0.6,
            x: 0,
            zIndex: 0,
            opacity: 0,
          };
      }
    },
    []
  );

  return (
    <div className="relative w-full flex justify-center mx-auto px-4 md:px-0">
      <div className="absolute flex max-w-4xl mx-auto justify-between top-2/3 w-full">
        {/* Navigation Buttons - Hidden on mobile for better touch experience */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-sky-600/90 hover:bg-sky-700 shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
        >
          <FiChevronLeft className="text-white text-lg md:text-xl" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-sky-600/90 hover:bg-sky-700 shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
        >
          <FiChevronRight className="text-white text-lg md:text-xl" />
        </button>
      </div>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="flex justify-center space-x-2">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-sky-600 scale-110"
                  : "bg-slate-400 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
      {/* Center Template Info - Above Images */}
      <div className="w-full px-4 md:px-0">
        <div className="text-center mb-3 h-16 md:h-20 lg:h-24 flex flex-col justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
              {templates[currentIndex].name}
            </h3>
            <p className="text-sm md:text-base text-gray-600 max-w-xs md:max-w-md mx-auto px-2">
              {templates[currentIndex].description}
            </p>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative h-[200px] sm:h-[400px] md:h-[500px] lg:h-[500px] w-full flex items-end justify-center overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {templates.map((template, index) => {
            const position = getTemplatePosition(index);
            const { isMobile, isTablet } = screenSize;
            const style = getTemplateStyle(position, isMobile, isTablet);

            // Responsive image dimensions
            const getCenterImageSize = () => {
              if (isMobile) return "w-[250px] h-[300px]";
              if (isTablet) return "w-[400px] h-[500px]";
              return "w-[700px] h-[500px]";
            };

            const getSideImageSize = () => {
              if (isMobile) return "w-[180px] h-[220px]";
              if (isTablet) return "w-[320px] h-[384px]";
              return "w-[700px] h-[500px]";
            };

            return (
              <motion.div
                key={template.id}
                className={`absolute ${
                  position === "center"
                    ? "top-1/2 -translate-y-1/2"
                    : "bottom-0"
                }`}
                animate={style}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  transformOrigin:
                    position === "center" ? "center bottom" : "center bottom",
                }}
              >
                <div className="relative overflow-hidden shadow-lg md:shadow-2xl ">
                  {/* Template Image */}
                  <img
                    src={template.image}
                    alt={template.name}
                    className={`object-cover object-top ${
                      position === "center"
                        ? `${getCenterImageSize()} opacity-100`
                        : `${getSideImageSize()} opacity-80`
                    }`}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
    </div>
  );
};

export default memo(TemplateCarousel);
