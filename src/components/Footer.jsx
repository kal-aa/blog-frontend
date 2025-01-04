import { FaEnvelope, FaPhone, FaTelegramPlane } from "react-icons/fa";
import { useMatch, NavLink } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const matchHome = useMatch("/home/:id");
  const matchAddOrders = useMatch("/add-blog/:id");
  const matchYourOrders = useMatch("/your-blogs/:id");
  const matchManageYourAcc = useMatch("/manage-your-acc/:id");
  const matchAboutUs = useMatch("/about-us/:id");
  const matchContactUs = useMatch("/contact-us/:id");

  const id =
    matchHome?.params.id ||
    matchAddOrders?.params.id ||
    matchYourOrders?.params.id ||
    matchManageYourAcc?.params.id ||
    matchAboutUs?.params.id ||
    matchContactUs?.params.id ||
    "No param found";

  const handleUpArrow = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      <div className="bg-blue-800 text-slate-300 h-[135px] mt-5 font-serif">
        <div className="flex items-center justify-around md:py-4 text-sm font-bold md:flex-row-reverse relative">
          <div className="flex flex-col items-center space-y-2">
            <NavLink
              to={`/manage-your-acc/${id}`}
              className="hover:text-blue-400 sm:hidden"
            >
              Manage your account
            </NavLink>
            <a
              href="mailto:sadkalshayee@gmail.com"
              className="flex space-x-2 items-center"
            >
              <FaEnvelope size={20} style={{ color: "darkBlue" }} />
              <p className="footer-icons">Email</p>
            </a>
            <a
              href="tel: +251968350741"
              className="flex space-x-2 items-center"
            >
              <FaPhone size={20} style={{ color: "green" }} />
              <p className="footer-icons">Phone</p>
            </a>
            <a
              href="tg://resolve?domain=Silent7951"
              className="flex space-x-2 items-center"
            >
              <FaTelegramPlane size={24} />
              <p className="footer-icons">Telegram</p>
            </a>
          </div>
          <div className="text-center font-bold hidden md:block">
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
            title="^^^To the top^^^"
            onClick={handleUpArrow}
            className="absolute right-4 top-1 text-xl text-yellow-700 md:right-[48%]"
          />
        </div>
        <div className="text-center font-bold md:hidden">
          © 2024 Kalab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
