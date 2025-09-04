import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Step 1: Upload or Create",
    videoTitle: "Upload or Create Your Resume",
    description:
      "Begin by uploading your current resume in PDF or DOCX format. If you don't have one, our intuitive builder will guide you through creating a new resume from scratch, ensuring you cover all essential sections.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257462/step1_wpszpo.mp4",
  },
  {
    id: 2,
    title: "Step 2: Edit and Refine",
    videoTitle: "Edit and Refine Your Resume",
    description:
      "Our real-time editor allows you to perfect every detail. Update your contact information, professional summary, work experience, and skills. Use our formatting tools to ensure your resume is clean and readable.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257466/step2_ylozmt.mp4",
  },
  {
    id: 3,
    title: "Step 3: Choose a Professional Template",
    videoTitle: "Choose a Professional Template",
    description:
      "Make a lasting impression by selecting from our library of professionally designed templates. Whether you prefer a modern, classic, or standard layout, we have a style that fits your career goals.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257466/step3_jjgx49.mp4",
  },
  {
    id: 4,
    title: "Step 4: Organize and Customize",
    videoTitle: "Organize and Customize Your Resume",
    description:
      "Tailor your resume to the job you're applying for. Drag and drop sections to reorder them, customize colors and fonts, and ensure the most important information is front and center.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753257462/step4_rbvyin.mp4",
  },
  {
    id: 5,
    title: "Step 5: Download and Share",
    videoTitle: "Download and Share Your Resume",
    description:
      "With one click, download your resume as a high-quality, ATS-friendly PDF. Your resume is now ready to be sent to recruiters and uploaded to job application portals.",
    videoUrl:
      "https://res.cloudinary.com/dyetf2h9n/video/upload/fl_progressive,q_auto,f_auto/v1753268547/step5_swnkij.mp4",
  },
];

const Steps = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-full px-6 py-2 mb-6 shadow-sm">
          <span className="w-2 h-2 bg-sky-600 rounded-full"></span>
          <span className="text-sm font-medium text-gray-800">
            Simple Process
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How ResuMate Works
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Follow these simple steps to create your perfect professional resume
          in minutes.
        </p>
      </motion.div>

      <div className="relative max-w-5xl mx-auto z-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row items-center my-16 lg:my-20 gap-8 lg:gap-12 ${
              index % 2 === 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Video Section */}
            <div className="w-full lg:w-1/2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="bg-white p-1 rounded-2xl shadow-lg border-[1px] border-gray-100 group-hover:shadow-xl transition-all duration-300">
                  <div className="relative h-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <video
                      src={step.videoUrl}
                      autoPlay
                      preload="auto"
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      title={step.videoTitle}
                    />
                    {/* Video overlay for better visual */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -inset-2 bg-gradient-to-r from-sky-200/20 to-sky-200/20 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2">
              <div className="max-w-lg">
                {/* Step Number Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <div className="bg-sky-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    {step.id}
                  </div>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-sky-600 to-sky-600"></div>
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight"
                >
                  {step.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                  className="text-base md:text-base text-gray-600 leading-relaxed"
                >
                  {step.description}
                </motion.p>

                {/* Optional decorative dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.7 }}
                  viewport={{ once: true }}
                  className="w-2 h-2 bg-sky-400 rounded-full mt-6"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Steps;
