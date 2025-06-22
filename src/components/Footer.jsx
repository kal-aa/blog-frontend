import {
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaTelegramPlane,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const Footer = () => {
  const { user } = useUser();
  const id = user?.id;
  const navigate = useNavigate();

  const handleUpArrow = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative flex flex-col justify-center bg-blue-800 text-slate-300 h-[140px] mt-10 font-serif  z-10">
      <div className="relative flex items-center justify-around text-sm font-bold md:py-4 md:flex-row-reverse">
        <div className="flex flex-col items-center space-y-2">
          <NavLink
            to={`/manage-your-acc/${id}`}
            className="mt-2 hover:text-blue-400 sm:hidden"
          >
            Manage your account
          </NavLink>
          <a
            href="mailto:sadkalshayee@gmail.com"
            className="flex items-center space-x-2"
          >
            <FaEnvelope size={20} style={{ color: "darkBlue" }} />
            <p className="footer-icons">Email</p>
          </a>
          <a href="tel: +251968350741" className="flex items-center space-x-2">
            <FaPhone size={20} style={{ color: "green" }} />
            <p className="footer-icons">Phone</p>
          </a>
          <a
            href="tg://resolve?domain=Silent7951"
            className="flex items-center space-x-2"
          >
            <FaTelegramPlane size={24} />
            <p className="footer-icons">Telegram</p>
          </a>
        </div>
        <div className="hidden font-bold text-center md:block">
          © 2024 Kalab. All rights reserved.
        </div>
        <div className="hidden sm:block">
          <div className="flex flex-col items-center space-y-2 sm:mt-2">
            <NavLink
              to={`/manage-your-acc/${id}`}
              className="hover:text-blue-400"
            >
              Manage your account
            </NavLink>
            <NavLink to={`/about-us/${id}`} className="hover:text-blue-400">
              About us
            </NavLink>
            <NavLink to={`/contact-us/${id}`} className="hover:text-blue-400">
              contact us
            </NavLink>
          </div>
        </div>
        <FaArrowUp
          title="scroll to top"
          onClick={handleUpArrow}
          className="absolute right-4 top-1 text-xl text-yellow-600 md:right-[50%]"
        />
      </div>
      <div className="font-bold text-center md:hidden">
        © 2024 Kalab. All rights reserved.
      </div>
      <FaSignOutAlt
        title="log out"
        size={18}
        className="absolute z-10 text-yellow-600 right-4 bottom-1"
        onClick={() => navigate("/")}
      />
    </footer>
  );
};

export default Footer;
