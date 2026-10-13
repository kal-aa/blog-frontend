import {
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaTelegramPlane,
  FaArrowUp,
  FaGlobe,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const phoneNumber = "+971521768664";
  const email = "kalabmuhamed@gmail.com";
  const portfolioUrl = "https://kal-portfolio-site.vercel.app/";

  useEffect(() => {
    const handleScroll = () => {
      const isScrollable =
        document.documentElement.scrollHeight > window.innerHeight;

      setShowScrollTop(isScrollable && window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) return;

    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      window.alert("Unable to log out. Please try again.");
    }
  };

  return (
    <footer className="relative z-10 mt-10 bg-blue-900 px-5 py-8 text-slate-200">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {/* Contact Information */}
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <h2 className="text-base font-bold text-white">Get in Touch</h2>

          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 transition-colors hover:text-white"
          >
            <FaEnvelope
              size={18}
              aria-hidden="true"
              className="text-blue-300"
            />
            <span>{email}</span>
          </a>

          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-3 transition-colors hover:text-white"
          >
            <FaPhone size={17} aria-hidden="true" className="text-green-400" />
            <span>+971 52 176 8664</span>
          </a>

          <a
            href="https://t.me/Silent7951"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-colors hover:text-white"
          >
            <FaTelegramPlane size={20} aria-hidden="true" />
            <span>Telegram</span>
          </a>

          <a
            href="https://wa.me/971521768664"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition-colors hover:text-white"
          >
            <FaPhone size={17} aria-hidden="true" className="text-green-400" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-base font-bold text-white">Quick Links</h2>

          <NavLink
            to="/about-us"
            className="transition-colors hover:text-white"
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact-us"
            className="transition-colors hover:text-white"
          >
            Contact Us
          </NavLink>

          <NavLink
            to="/manage-account"
            className="transition-colors hover:text-white"
          >
            Manage Your Account
          </NavLink>

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <FaGlobe size={16} aria-hidden="true" />
            My Portfolio
          </a>
        </nav>

        {/* Account Actions */}
        <div className="flex flex-col items-center gap-4 sm:col-span-2 md:col-span-1">
          <h2 className="text-base font-bold text-white">Account</h2>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-500 px-4 py-2 transition-colors hover:border-white hover:bg-blue-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaSignOutAlt size={16} aria-hidden="true" />
            Log Out
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-8 max-w-6xl border-t border-blue-700 pt-5 text-center text-sm text-slate-300">
        © {new Date().getFullYear()} Kalab. All rights reserved.
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="fixed bottom-6 right-5 z-50 rounded-full bg-black p-3 text-white-950 shadow-lg transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-8"
        >
          <FaArrowUp size={18} aria-hidden="true" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
