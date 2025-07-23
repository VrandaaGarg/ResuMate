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
    <section className="py-12 md:py-32 px-6 md:px-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 [font-family:'Poppins',sans-serif]">
          How It Works
        </h2>
        <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto [font-family:'Poppins',sans-serif]">
          Follow these simple steps to create your perfect resume.
        </p>
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row items-center my-12 md:my-16 gap-8 md:gap-0 ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Video Section */}
            <div className="w-full md:w-1/2 px-4 md:px-12">
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-1 rounded-2xl shadow-2xl">
                <div className="w-full aspect-w-4 aspect-h-3 bg-gray-300 rounded-xl shadow-md flex items-center justify-center overflow-hidden">
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
                </div>
              </div>
            </div>

            {/* Text Content Section */}
            <div className="w-full md:w-1/2 px-4 md:px-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shrink-0 w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center text-md md:text-2xl font-bold shadow-lg">
                  {step.id}
                </div>
                <div>
                  <h3 className="text-lg md:text-3xl font-bold text-gray-800 [font-family:'Poppins',sans-serif]">
                    {step.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm md:text-lg text-gray-700 [font-family:'Poppins',sans-serif]">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Steps;
