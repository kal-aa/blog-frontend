import {
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaMapMarker,
} from "react-icons/fa";

const ContactUs = () => {
  const socailMediaStyle = " hover:text-blue-600 inline";

  return (
    <div className="mx-[5%] px-[5%] md:text-center shadow-2xl">
      <div>
        <h1 className="text-2xl -ml-1">Contact us</h1>
        <p>
          We’re here to help! Feel free to reach out to us using any of the
          methods below.
        </p>
      </div>

      {/* Phone no. */}
      <section className="border-b-4 pb-2 my-6 md:inline-block md:mr-[3%]">
        <h2 className="text-xl md:mr-2">Phone:</h2>
        <a href="tel: +251968350741">
          <FaPhone className="inline mr-2 text-green-500 mb-1" />
          <p className="inline hover:text-neutral-500">+251 968350741</p>
        </a>
        <p>Availabel: Monday to Monday, 9:00 AM - 5:00 PM</p>
      </section>

      {/* Email address */}
      <section className="border-b-4 pb-2 md:inline-block md:ml-[3%]">
        <div>
          <h2 className="text-xl md:mr-2">Email:</h2>
          <a href="mailto: sadkalshayee@gmail.com">
            <FaEnvelope className="inline mr-2 text-blue-800 mb-1" />
            <p className="inline hover:text-neutral-500">
              sadkalshayee@gmail.com
            </p>
          </a>
          <p>We aim to respond within 24 hours</p>
        </div>
      </section>

      {/* Address */}
      <section className="my-6 border-b-4 pb-2">
        <h2 className="text-xl">Address:</h2>
        <FaMapMarker className="inline mr-2 mb-1 text-red-500" />
        <p className="inline">
          Ethiopia, Qobo<span className="text-xs">(for the time being)</span>
        </p>
      </section>

      {/* Other social medias */}
      <section>
        <h2 className="text-xl">Social Media</h2>
        <p>Follow us on social media for the latest updates</p>
        <div className="flex flex-col gap-1 mt-2 pl-5 md:items-center">
          <a>
            <p className={socailMediaStyle}>Instagram</p>
            <FaInstagram className="inline text-purple-900 ml-1" />
          </a>
          <a>
            <p className={socailMediaStyle}>Facebook</p>
            <FaFacebook className="inline text-blue-800 mb-1 ml-1" />
          </a>
          <a>
            <p className={socailMediaStyle}>Twitter</p>
            <FaTwitter className="inline text-blue-900 mb-1 ml-1" />
          </a>
          <a>
            <p className={socailMediaStyle}>Linkedin </p>
            <FaLinkedin className="inline text-blue-600 mb-1" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
