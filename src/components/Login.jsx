import { useState } from "react";
import { NavLink } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { FaLock } from "react-icons/fa";
import PropTypes from "prop-types";

const Login = ({ loginSubmit }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [passwordShould, setPasswordShould] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setPasswordShould("Password must be greater than 8 characters");
      setTimeout(() => {
        setPasswordShould("");
      }, 4000);
    } else {
      loginSubmit(formData, setError, setIsLogging);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-[10%] sm:px-[20%] md:px-[25%] lg:px-[30%] -mt-20">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <div
          className={
            error &&
            "flex justify-center items-center text-center border-l-8 border-red-500 px-2 rounded-xl text-red-600 border w-full h-20"
          }
        >
          {error}
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="E.g. sadkalshayee@gmail.com"
            className="inputStyle"
          />
          <label htmlFor="password">
            Password:{" "}
            <p className="text-red-600 text-sm inline-block">
              {passwordShould}
            </p>
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="inputStyle"
            />
            <FaLock className="lockStyle" />
          </div>
          <button
            disabled={isLogging}
            className={`w-full rounded-md bg-black text-white py-2 mt-2 ${
              !isLogging && "hover:scale-105"
            } transition-all duration-200 ease-out`}
          >
            {isLogging ? "Submitting..." : "Submit"}
            {isLogging && (
              <ClipLoader color="white" size={10} className="ml-1" />
            )}
          </button>
        </form>
        <div className="w-full flex items-center justify-center mt-6">
          <span className="flex-grow border-t border-black mx-4"></span>
          <span className="text-sm">OR</span>
          <span className="flex-grow border-t border-black mx-4"></span>
        </div>
        <NavLink to="/sign-up" className="hover:underline text-lg">
          sign up
        </NavLink>
      </div>
    </>
  );
};

Login.propTypes = {
  loginSubmit: PropTypes.func,
};

export default Login;
