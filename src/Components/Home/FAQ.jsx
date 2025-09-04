import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiMail } from "react-icons/fi";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How is ResuMate different from other resume builders?",
      answer:
        "ResuMate offers AI-powered resume optimization, ATS-friendly templates, and real-time feedback. Our platform uses advanced algorithms to analyze job descriptions and tailor your resume accordingly, ensuring maximum compatibility with Applicant Tracking Systems.",
    },
    {
      question: "Are the resume templates ATS-friendly?",
      answer:
        "Yes! All our templates are specifically designed to be ATS-compatible. We ensure proper formatting, readable fonts, and structured layouts that pass through Applicant Tracking Systems while maintaining professional aesthetics.",
    },
    {
      question: "Can I customize the resume templates?",
      answer:
        "Absolutely! ResuMate offers extensive customization options including colors, fonts, layouts, and sections. You can personalize every aspect of your resume while maintaining ATS compatibility and professional standards.",
    },

    {
      question: "How many resumes can I create with ResuMate?",
      answer:
        "With ResuMate, you can create unlimited resumes and save multiple versions. This allows you to tailor different resumes for various job applications and industries without any restrictions.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "ResuMate is currently available as a responsive web application that works seamlessly on all devices including smartphones and tablets. A dedicated mobile app is in development and will be available soon.",
    },
    {
      question: "What if I need help or have technical issues?",
      answer:
        "Our support team is here to help! You can reach out to us anytime for assistance with technical issues, questions about features, or general guidance on resume building.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-24 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Left Side - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-sky-600">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Everything you need to know about ResuMate's AI-powered resume
              building platform.
            </p>

            {/* Support Button */}
            <motion.a
              href="mailto:resumate@vrandagarg.in"
              className="inline-flex items-center gap-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMail className="text-lg" />
              Contact Support
            </motion.a>

            <p className="text-sm text-gray-500 mt-4">
              Still have questions? Contact our support team
            </p>
          </motion.div>

          {/* Right Side - FAQ Items */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="space-y-1 md:space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className=" overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between  transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <FiChevronDown className="text-sky-600 text-xl" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
