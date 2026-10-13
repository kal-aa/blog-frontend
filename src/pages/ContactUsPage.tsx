import { NavLink } from "react-router-dom";

const ContactUsPage = () => {
  const phoneNumber = "+971 52 176 8664";
  const email = "kalabmuhamed@gmail.com";
  const portfolioUrl = "https://kal-portfolio-site.vercel.app/";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        {/* Hero Section */}
        <section className="bg-slate-900 px-6 py-12 text-white sm:px-10 sm:py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Contact Us
          </p>

          <h1 className="mb-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Let's Talk
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Have a question, an idea, or a project in mind? Get in touch. We'd
            love to hear from you.
          </p>
        </section>

        <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-12">
          {/* Contact Information */}
          <section aria-labelledby="contact-info-heading">
            <h2
              id="contact-info-heading"
              className="mb-3 text-2xl font-bold tracking-tight text-slate-800"
            >
              Get in Touch
            </h2>

            <p className="mb-8 leading-7 text-slate-600">
              Choose whichever contact method works best for you. I'm happy to
              connect.
            </p>

            <div className="space-y-4">
              {/* Phone */}
              <div className="rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md">
                <h3 className="mb-2 font-semibold text-slate-800">Phone</h3>

                <a
                  href="tel:+971521768664"
                  className="break-words text-blue-900 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  {phoneNumber}
                </a>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md">
                <h3 className="mb-2 font-semibold text-slate-800">Email</h3>

                <a
                  href={`mailto:${email}`}
                  className="break-words text-blue-900 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  {email}
                </a>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-2 font-semibold text-slate-800">Location</h3>

                <p className="text-slate-600">Dubai, United Arab Emirates</p>
              </div>

              {/* Portfolio */}
              <div className="rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md">
                <h3 className="mb-2 font-semibold text-slate-800">Portfolio</h3>

                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words text-blue-900 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  View My Portfolio
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/971521768664"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 sm:w-auto"
            >
              Contact on WhatsApp
            </a>
          </section>

          {/* Additional Links */}
          <section
            aria-labelledby="contact-options-heading"
            className="flex flex-col justify-center rounded-xl bg-blue-50 p-6 sm:p-8"
          >
            <h2
              id="contact-options-heading"
              className="mb-4 text-2xl font-bold tracking-tight text-slate-800"
            >
              Let's Connect
            </h2>

            <p className="mb-6 leading-7 text-slate-600">
              Whether you have a question, want to discuss a project, or simply
              want to connect, feel free to reach out.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("Website Inquiry")}`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                Send an Email
              </a>

              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                Explore My Portfolio
              </a>

              <NavLink
                to="/about-us"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                About Us
              </NavLink>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ContactUsPage;
