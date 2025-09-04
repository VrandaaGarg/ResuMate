import React from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Aarav Mehta",
    image: "user1.jpeg",
    feedback:
      "ResuMate helped me land my first internship. The AI suggestions were incredibly smart and on-point! The templates are professional and the ATS compatibility checker gave me confidence that my resume would pass through applicant tracking systems.",
    role: "Software Developer",
    company: "Tech Corp",
    rating: 5,
  },
  {
    name: "Simran Kaur",
    image: "user2.jpeg",
    feedback:
      "Building my resume felt effortless and modern. Loved the templates and the ATS scoring feature! The real-time editor made it so easy to customize everything perfectly.",
    role: "Marketing Manager",
    company: "Digital Agency",
    rating: 5,
  },
  {
    name: "Rahul Sharma",
    image: "user3.png",
    feedback:
      "It's the best resume builder I've used — simple, elegant, and very effective with job matching tools. The AI-powered suggestions helped me tailor my resume perfectly.",
    role: "Data Analyst",
    company: "Analytics Inc",
    rating: 5,
  },
  {
    name: "Priya Patel",
    image: "user4.png",
    feedback:
      "The job fit analyzer feature is a game-changer! It helped me understand exactly what skills to highlight for different positions. My interview rate increased significantly after using ResuMate.",
    role: "Product Manager",
    company: "Innovation Labs",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <div className="font-sans flex flex-col items-center py-16 pt-24 px-6 sm:px-6 lg:px-8 text-gray-900 bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-8 md:mb-16"
      >
        <h1 className="text-3xl md:text-4xl font-semibold text-center max-w-4xl mb-3">
          Trusted by Professionals Worldwide
        </h1>

        <p className="text-base sm:text-lg text-gray-600 text-center max-w-3xl mb-4">
          Join thousands of job seekers who have successfully landed their dream
          jobs using ResuMate's AI-powered resume builder and optimization
          tools.
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full max-w-6xl mx-auto">
        {/* First Row */}
        {/* First testimonial - takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          viewport={{ once: true }}
          className=" md:col-span-4 bg-sky-50/50 p-4 md:p-8 rounded-xl flex flex-col justify-between border border-sky-100 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 "
        >
          <div className="mb-8">
            {/* Rating Stars */}
            <div className="flex items-center mb-6">
              {[...Array(testimonials[0].rating)].map((_, index) => (
                <FiStar
                  key={index}
                  className="w-5 h-5 text-yellow-400 fill-current mr-1"
                />
              ))}
            </div>
            <p className="text-base sm:text-lg lg:text-md text-gray-800 leading-relaxed">
              "{testimonials[0].feedback}"
            </p>
          </div>
          <div className="flex items-center">
            <img
              src={testimonials[0].image}
              alt={testimonials[0].name}
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
            />
            <div>
              <p className="font-semibold text-gray-900">
                {testimonials[0].name}
              </p>
              <p className="text-sm text-gray-600">{testimonials[0].role}</p>
              <p className="text-sm text-sky-600 font-medium">
                {testimonials[0].company}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Second testimonial - takes 1 column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="md:col-span-3 bg-sky-50/50 p-4 md:p-8 rounded-xl flex flex-col justify-between border border-sky-100 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 "
        >
          <div className="mb-6">
            {/* Rating Stars */}
            <div className="flex items-center mb-4">
              {[...Array(testimonials[1].rating)].map((_, index) => (
                <FiStar
                  key={index}
                  className="w-5 h-5 text-yellow-400 fill-current mr-1"
                />
              ))}
            </div>
            <p className="text-base sm:text-lg lg:text-md text-gray-800 leading-relaxed md:mb-4">
              "{testimonials[1].feedback}"
            </p>
          </div>
          <div className="flex items-center md:mt-auto">
            <img
              src={testimonials[1].image}
              alt={testimonials[1].name}
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
            />
            <div>
              <p className="font-semibold text-gray-900 ">
                {testimonials[1].name}
              </p>
              <p className="text-sm text-gray-600">{testimonials[1].role}</p>
              <p className="text-sm text-sky-600 font-medium">
                {testimonials[1].company}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Second Row */}
        {/* Third testimonial - takes 1 column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="md:col-span-3 bg-sky-50/50 p-4 md:p-8 rounded-xl flex flex-col justify-between border border-sky-100 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 "
        >
          <div className="mb-6">
            {/* Rating Stars */}
            <div className="flex items-center mb-4">
              {[...Array(testimonials[2].rating)].map((_, index) => (
                <FiStar
                  key={index}
                  className="w-5 h-5 text-yellow-400 fill-current mr-1"
                />
              ))}
            </div>
            <p className="text-base sm:text-lg lg:text-md text-gray-800 leading-relaxed mb-4">
              "{testimonials[2].feedback}"
            </p>
          </div>
          <div className="flex items-center mt-auto">
            <img
              src={testimonials[2].image}
              alt={testimonials[2].name}
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
            />
            <div>
              <p className="font-semibold text-gray-900 ">
                {testimonials[2].name}
              </p>
              <p className="text-sm text-gray-600">{testimonials[2].role}</p>
              <p className="text-sm text-sky-600 font-medium">
                {testimonials[2].company}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fourth testimonial - takes 1 column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="md:col-span-4 bg-sky-50/50 p-4 md:p-8 rounded-xl flex flex-col justify-between border border-sky-100 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 "
        >
          <div className="mb-6">
            {/* Rating Stars */}
            <div className="flex items-center mb-4">
              {[...Array(testimonials[3].rating)].map((_, index) => (
                <FiStar
                  key={index}
                  className="w-5 h-5 text-yellow-400 fill-current mr-1"
                />
              ))}
            </div>
            <p className="text-base sm:text-lg lg:text-md text-gray-800 leading-relaxed mb-4">
              "{testimonials[3].feedback}"
            </p>
          </div>
          <div className="flex items-center mt-auto">
            <img
              src={testimonials[3].image}
              alt={testimonials[3].name}
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
            />
            <div>
              <p className="font-semibold text-gray-900 ">
                {testimonials[3].name}
              </p>
              <p className="text-sm text-gray-600">{testimonials[3].role}</p>
              <p className="text-sm text-sky-600 font-medium">
                {testimonials[3].company}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Testimonials;
