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
  const [isOnline, setIsOnline] = useState(true);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!navigator.onLine) {
      setIsOnline(false);
      setTimeout(() => {
        setIsOnline(true);
      }, 3000);
      return;
    } else {
      setIsOnline(true);
    }

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
    <div className="signupContainer">
      {!isOnline && <p className="noConnection">No internet connection</p>}
      <h1 className="text-3xl font-bold">Welcome Back</h1>
      <div className={isOnline && error && "errorStyle"}>{error}</div>

      {/* login form */}
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
          <p className="text-red-600 text-sm inline-block">{passwordShould}</p>
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
          {isLogging ? (
            <div>
              <span>submit</span>
              <ClipLoader color="white" size={10} className="ml-1" />
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {/* The "OR" option */}
      <div className="w-full flex items-center justify-center mt-6">
        <span className="flex-grow border-t border-black mx-4"></span>
        <span className="text-sm">OR</span>
        <span className="flex-grow border-t border-black mx-4"></span>
      </div>

      <NavLink to="/sign-up" className="hover:underline text-lg">
        sign up
      </NavLink>
    </div>
  );
};

Login.propTypes = {
  loginSubmit: PropTypes.func,
};

export default Login;
