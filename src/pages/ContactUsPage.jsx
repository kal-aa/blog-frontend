import {
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaMapMarker,
  FaTelegramPlane,
  FaWhatsapp,
  FaFacebook,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const socailMediaStyle = " hover:text-blue-600 inline";

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
          <p className="inline hover:text-neutral-500">+251 968350741</p>
        </a>
        <p>Available: Monday to Monday, 9:00 AM - 5:00 PM</p>
      </section>
      <section className="border-b-4 pb-2 md:inline-block md:ml-[3%]">
        <div>
          <h2 className="text-xl md:mr-2">Email:</h2>
          <a href="mailto: sadkalshayee@gmail.com">
            <FaEnvelope className="inline mb-1 mr-2 text-blue-800" />
            <p className="inline hover:text-neutral-500">
              sadkalshayee@gmail.com
            </p>
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
      <section>
        <h2 className="text-xl">Social Media</h2>
        <p>Follow us on social media for the latest updates</p>
        <div className="flex flex-col gap-1 pl-5 mt-2 md:items-center">
          <Link
            href="https://web.facebook.com/profile.php?id=61572989257505"
            target="_blank"
          >
            <span className={socailMediaStyle}>Facebook </span>
            <FaFacebook color="#0088CC" className="inline" />
          </Link>
          <Link href="https://t.me/@Silent7951" target="_blank">
            <span className={socailMediaStyle}>Linkedin </span>
            <FaLinkedin color="#0088CC" className="inline" />
          </Link>
          <Link
            data-testid="social-media-link"
            href="https://t.me/@Silent7951"
            target="_blank"
          >
            <span className={socailMediaStyle}>Telegram </span>
            <FaTelegramPlane color="#0088CC" className="inline" />
          </Link>
          <Link
            data-testid="social-media-link"
            href="https://wa.me/+251968350741"
            target="_blank"
          >
            <span className={socailMediaStyle}>WhatsApp </span>
            <FaWhatsapp color="#25D366" className="inline" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
