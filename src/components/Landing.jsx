import { NavLink } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <div className="z-10 relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl brightness-50 -mt-3"
          style={{ backgroundImage: "url(/assets/bg-blog.jpeg)" }}
        ></div>
        <div className="z-10 relative ">
          <div className="flex justify-between md:justify-around mt-3 mr-5">
            <img
              src="/assets/blog.jpeg"
              alt="Blog.jpeg"
              className="w-16 -mt-3"
            />
            <div className="space-x-5">
              <NavLink to="/log-in" className={"btnStyle"}>
                Log in
              </NavLink>
              <NavLink to="/sign-up" className={"btnStyle"}>
                Sign up
              </NavLink>
            </div>
          </div>

          <div>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet
            est asperiores eum itaque? Temporibus autem dolore rerum libero
            incidunt impedit architecto saepe? Quis ipsam, asperiores labore
            quibusdam repudiandae vero consequatur?Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Corporis ullam doloremque omnis
            sapiente nostrum dignissimos placeat nesciunt? Tempora sint in quas,
            ab impedit eum. Neque eum atque quaerat deserunt consectetur.
          </div>

          <div className="text-center">
            <NavLink
              to="/log-in"
              className="bg-yellow-200 font-semibold px-3 py-2 rounded-xl transform hover:bg-yellow-100"
            >
              Get Started
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
