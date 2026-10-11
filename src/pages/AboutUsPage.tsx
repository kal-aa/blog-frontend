import { NavLink } from "react-router-dom";

const AboutUsPage = () => {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Hero Section */}
      <section className="mb-12 rounded-2xl bg-slate-900 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          About Us
        </p>

        <h1 className="mb-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          About Abstruse Co.
        </h1>

        <p className="mx-auto max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          We believe in innovation, collaboration, and creating meaningful
          digital experiences. Our goal is to turn ideas into practical
          solutions that make a difference.
        </p>
      </section>

      <section
        role="note"
        aria-label="Demo content notice"
        className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl" aria-hidden="true">
            ℹ️
          </span>

          <div>
            <h2 className="mb-1 font-semibold text-blue-900">
              Demo Content Notice
            </h2>

            <p className="text-sm leading-6 text-blue-800">
              This page currently contains sample content for demonstration
              purposes. Company information, mission statements, and team
              details may not represent an actual business.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mb-12 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Who We Are
          </h2>

          <p className="mb-4 leading-7 text-slate-600">
            Abstruse Co. is built around the idea that good solutions begin with
            understanding people, identifying challenges, and finding better
            ways to solve them.
          </p>

          <p className="leading-7 text-slate-600">
            We value creativity, continuous learning, and thoughtful
            collaboration. We aim to create work that is useful, reliable, and
            designed with people in mind.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h3 className="mb-4 text-xl font-bold text-slate-800">
            What We Believe
          </h3>

          <ul className="space-y-4 text-slate-600">
            <li className="flex gap-3">
              <span className="font-bold text-blue-900">01.</span>
              <span>Innovation should solve real problems.</span>
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-900">02.</span>
              <span>Collaboration leads to better ideas.</span>
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-blue-900">03.</span>
              <span>Quality comes from continuous improvement.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="mb-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Our Mission and Vision
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            The principles that guide our work and shape our future.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-6 transition-shadow hover:shadow-md sm:p-8">
            <h3 className="mb-4 text-xl font-bold text-slate-800">
              Our Mission
            </h3>

            <p className="leading-7 text-slate-600">
              To develop thoughtful, accessible, and effective solutions that
              address real needs and deliver meaningful value.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 p-6 transition-shadow hover:shadow-md sm:p-8">
            <h3 className="mb-4 text-xl font-bold text-slate-800">
              Our Vision
            </h3>

            <p className="leading-7 text-slate-600">
              To build a future where creativity, technology, and collaboration
              help people and businesses achieve more.
            </p>
          </article>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-12 rounded-2xl bg-slate-50 px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Our Team
          </h2>

          <p className="mb-6 leading-7 text-slate-600">
            Great work comes from curiosity, dedication, and a willingness to
            learn. We believe in bringing different perspectives together to
            create better results.
          </p>

          <p className="leading-7 text-slate-600">
            We are committed to improving our skills, sharing ideas, and
            approaching every challenge with an open mind.
          </p>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="mb-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            What Drives Us
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Our approach to creating work we can be proud of.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-6">
            <h3 className="mb-3 text-lg font-bold text-slate-800">
              Innovation
            </h3>

            <p className="leading-7 text-slate-600">
              Exploring new ideas and finding practical ways to improve existing
              solutions.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 p-6">
            <h3 className="mb-3 text-lg font-bold text-slate-800">Quality</h3>

            <p className="leading-7 text-slate-600">
              Paying attention to details and aiming for dependable,
              user-friendly results.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 p-6 sm:col-span-2 lg:col-span-1">
            <h3 className="mb-3 text-lg font-bold text-slate-800">Growth</h3>

            <p className="leading-7 text-slate-600">
              Learning from experience, welcoming feedback, and improving with
              every challenge.
            </p>
          </article>
        </div>
      </section>

      {/* Contact Section */}
      <section
        aria-labelledby="contact-heading"
        className="rounded-2xl bg-blue-50 px-6 py-10 sm:px-10 sm:py-12"
      >
        <h2
          id="contact-heading"
          className="mb-3 text-center text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl"
        >
          Get in Touch
        </h2>

        <p className="mx-auto mb-8 max-w-xl text-center leading-7 text-slate-600">
          Have questions or want to work with us? We'd love to hear from you.
        </p>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5">
            <h3 className="mb-2 font-semibold text-slate-800">Location</h3>

            <p className="text-slate-600">Dubai, United Arab Emirates</p>
          </div>

          <div className="rounded-xl bg-white p-5">
            <h3 className="mb-2 font-semibold text-slate-800">Phone</h3>

            <a
              href="tel:+971521768664"
              className="break-words text-blue-900 hover:text-blue-700"
            >
              +971 52 176 8664
            </a>
          </div>

          <div className="rounded-xl bg-white p-5">
            <h3 className="mb-2 font-semibold text-slate-800">Email</h3>

            <a
              href="mailto:kalabmuhamed@gmail.com"
              className="break-words text-blue-900 hover:text-blue-700"
            >
              kalabmuhamed@gmail.com
            </a>
          </div>

          <div className="rounded-xl bg-white p-5">
            <h3 className="mb-2 font-semibold text-slate-800">Portfolio</h3>

            <a
              href="https://kal-portfolio-lime.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="break-words text-blue-900 hover:text-blue-700"
            >
              View My Portfolio
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="https://wa.me/971521768664"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
          >
            Contact on WhatsApp
          </a>

          <NavLink
            to="/contact-us"
            className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            Contact Us
          </NavLink>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
