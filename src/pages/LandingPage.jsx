import { NavLink } from "react-router-dom";
import LandingBlogCard from "../components/LandingBlogCard";

const LandingPage = () => {
  return (
    <section className="landing-container">
      <div className="flex justify-between pt-8 mr-5 px-[5%] md:px-[15%] lg-[20%]">
        <img
          src={import.meta.env.VITE_PUBLIC_URL + "assets/images/blog.jpeg"}
          alt="Blog.jpeg"
          className="w-16 -mt-3"
        />
        <div className="space-x-5">
          <NavLink to="/log-in" className="btn-style">
            Log in
          </NavLink>
          <NavLink to="/sign-up" className="btn-style">
            Sign up
          </NavLink>
        </div>
      </div>

      <div className="px-[10%] md:px-[20%] lg-[25%]">
        {/* Welcome message for new users */}
        <p className="bg-gradient-to-tr from-red-200 via-slate-400 to-stone-500 py-[8%] px-[10%] indent-1 font-bold text-sm rounded-[25%] md:text-base md:rounded-full">
          Welcome to BlogSphere, your go-to platform for sharing ideas, stories,
          and creativity with the world! Whether you&apos;re a seasoned writer
          or just getting started, our user-friendly tools make it easy to
          create, edit, and publish your content. Connect with a community of
          readers and writers, engage through comments and discussions, and
          explore a diverse range of topics. Start your blogging journey today
          and let your voice be heard!
        </p>
        {/* Blog post card */}
        <LandingBlogCard />
      </div>

      {/* Get Started button */}
      <div className="mt-16 text-center">
        <NavLink
          to="/sign-up"
          className="px-4 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-500/80"
        >
          Get Started
        </NavLink>
      </div>
    </section>
  );
};

export default LandingPage;
