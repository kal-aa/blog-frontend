import {
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaMapMarker,
  FaTelegramPlane,
  FaWhatsapp,
  FaFacebook,
} from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const socialMediaStyle = "hover:text-blue-600 inline";

  return (
    <div className="mt-5 mx-[5%] px-[5%] md:text-center shadow-2xl">
      <div>
        <h1 className="-ml-1 text-2xl">Contact us</h1>
        <p>
          We’re here to help! Feel free to reach out to us using any of the
          methods below.
        </p>
      </div>
      <section className="border-b-4 pb-2 my-6 md:inline-block md:mr-[3%]">
        <h2 className="text-xl md:mr-2">Phone:</h2>
        <a href="tel: +251968350741">
          <FaPhone className="inline mb-1 mr-2 text-green-500" />
          <span className="inline hover:text-neutral-500">+251 968350741</span>
        </a>
        <p>Available: Monday to Monday, 9:00 AM - 5:00 PM</p>
      </section>
      <section className="border-b-4 pb-2 md:inline-block md:ml-[3%]">
        <div>
          <h2 className="text-xl md:mr-2">Email:</h2>
          <a href="mailto: sadkalshayee@gmail.com">
            <FaEnvelope className="inline mb-1 mr-2 text-blue-800" />
            <span className="inline hover:text-neutral-500">
              sadkalshayee@gmail.com
            </span>
          </a>
          <p>We aim to respond within 24 hours</p>
        </div>
      </section>
      <section className="pb-2 my-6 border-b-4">
        <h2 className="text-xl">Address:</h2>
        <FaMapMarker className="inline mb-1 mr-2 text-red-500" />
        <p className="inline">
          Ethiopia, Qobo<span className="text-xs">(for the time being)</span>
        </p>
      </section>
      <section className="pb-2 my-6 border-b-4">
        <h2 className="text-xl">Website:</h2>
        <MdFindInPage className="inline mb-1 mr-2 text-red-500" />
        <a
          href="https://kal-portfolio-lime.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-900 underline hover:underline-offset-2"
          aria-label="Personal Profile of Kalab Sisay"
        >
          Portfolio app
        </a>
      </section>

      <section>
        <h2 className="text-xl">Social Media</h2>
        <p>Follow us on social media for the latest updates</p>
        <div className="flex flex-col gap-1 pl-5 mt-2 md:flex-row md:gap-4 md:items-center md:justify-center">
          <a
            href="https://web.facebook.com/profile.php?id=61572989257505"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook profile"
          >
            <span className={socialMediaStyle}>Facebook </span>
            <FaFacebook color="#0088CC" className="inline" />
          </a>
          <a
            href="https://www.linkedin.com/in/kalab-muhamed-881139351"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkedin profile"
          >
            <span className={socialMediaStyle}>Linkedin </span>
            <FaLinkedin color="#0088CC" className="inline" />
          </a>
          <a
            href="https://t.me/Silent7951"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram profile"
          >
            <span className={socialMediaStyle}>Telegram </span>
            <FaTelegramPlane color="#0088CC" className="inline" />
          </a>
          <a
            href="https://wa.me/+251968350741"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp chat"
          >
            <span className={socialMediaStyle}>WhatsApp </span>
            <FaWhatsapp color="#25D366" className="inline" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
