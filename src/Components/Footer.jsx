// src/components/Footer.jsx
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiGoogleforms } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-[#0f172a] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          {/* Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-black"
          >
            <SiGoogleforms className="text-2xl" />
            ResuMate
          </Link>

          {/* Footer Links */}
          <ul className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
            <li>
              <Link to="/about" className="hover:text-sky-700 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-sky-700 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-sky-700 transition">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-sky-700 transition">
                Contact
              </Link>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 text-gray-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-700 transition"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-700 transition"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-700 transition"
            >
              <FaTwitter size={22} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-2 border-transparent" />

        {/* Copyright */}
        <p className="text-sm text-center text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">ResuMate</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
