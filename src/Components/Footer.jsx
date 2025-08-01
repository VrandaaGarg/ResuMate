import { motion } from "framer-motion";
import {
  FaGithub,
  FaHeart,
  FaBug,
  FaEnvelope,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGoogleforms, SiPeerlist } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/VrandaaGarg/ResuMate",
      label: "GitHub",
    },
    { icon: FaXTwitter, href: "https://x.com/vranda_garg_", label: "Twitter" },

    { icon: FaEnvelope, href: "mailto:resumate@vrandagarg.in", label: "Email" },

    {
      icon: SiPeerlist,
      href: "https://peerlist.io/vrandagarg",
      label: "Peerlist",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-700 relative">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="flex items-center gap-3 mb-1 md:mb-3">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="p-1 md:p-2 bg-gradient-to-r from-sky-500 to-blue-600 rounded md:rounded-lg shadow-md"
                >
                  <SiGoogleforms className="text-sm md:text-xl text-white" />
                </motion.div>
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  ResuMate
                </span>
              </div>

              <p className="text-[14px] md:text-sm text-gray-600 text-center md:text-left max-w-md">
                AI-powered resume builder for your career success
              </p>

              {/* Created with Love */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-gray-500 text-[14px] md:text-sm mt-2"
              >
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <FaHeart className="text-red-400" />
                </motion.div>
                <span>by ResuMate</span>
              </motion.div>
            </motion.div>

            {/* Right Section - Social Links & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-end gap-4"
            >
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-100 hover:bg-sky-100 border border-gray-200 hover:border-sky-200 rounded-lg text-gray-600 hover:text-sky-600 transition-all duration-300"
                    title={social.label}
                  >
                    <social.icon className="text-[14px] md:text-xl" />
                  </motion.a>
                ))}
              </div>

              {/* Report Bug Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open(
                    "mailto:resumate@vrandagarg.in?subject=Bug%20Report&body=Please%20describe%20the%20issue%20you%20encountered.",
                    "_blank"
                  )
                }
                className="flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-[14px] md:text-sm font-medium transition-all duration-300"
              >
                <FaBug size={12} />
                <span>Report Bug</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-center gap-3 text-[14px] md:text-sm text-gray-500"
            >
              <p>© {currentYear} ResuMate. All rights reserved.</p>

              <div className="flex items-center gap-4">
                <Link
                  to="#"
                  className="hover:text-sky-600 transition-colors duration-200"
                >
                  Privacy
                </Link>
                <Link
                  to="#"
                  className="hover:text-sky-600 transition-colors duration-200"
                >
                  Terms
                </Link>
                <Link
                  to="mailto:resumate@vrandagarg.in"
                  className="hover:text-sky-600 transition-colors duration-200"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
