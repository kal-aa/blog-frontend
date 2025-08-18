import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { FaGithub, FaLock } from "react-icons/fa";
import PropTypes from "prop-types";
import { FcGoogle } from "react-icons/fc";

const Login = ({ emailLogin, googleSignIn, githubSignIn }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [isLogWithEmail, setIsLogWithEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setError("");

    if (formData.password.length < 8) {
      setPasswordError("Password must be greater than 8 characters");
      return;
    }

    try {
      setIsLogging(true);
      setIsLogWithEmail(true);
      await emailLogin(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogging(false);
      setIsLogWithEmail(false);
    }
  };

  const handleLoginWithPopup = async (method) => {
    try {
      setIsLogging(true);
      await method();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="text-3xl font-bold">Welcome Back</h1>
      <div className={error ? "error-style" : ""}>{error}</div>

      {/* login form */}
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="email">
          Email:
          <input
            ref={emailInputRef}
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="yourname@example.com"
            disabled={isLogging}
            className="input-style"
          />
        </label>
        <label htmlFor="password" className="relative">
          Password:{" "}
          <p className="inline-block text-sm text-red-600">{passwordError}</p>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            disabled={isLogging}
            className="input-style"
          />
          <FaLock className="lock-style" />
        </label>
        <div className="flex justify-end">
          {isLogging ? (
            <span className="text-blue-800/70">Forgot Password</span>
          ) : (
            <Link
              to="/reset-password"
              state={{ email: formData.email }}
              className="text-blue-800 cursor-pointer hover:text-blue-800/80"
            >
              Forgot Password
            </Link>
          )}
        </div>
        <button
          type="submit"
          disabled={isLogging}
          className="!w-full bg-black text-white disabled:bg-black/50 sign-btn mt-3"
        >
          <span>Submit</span>
          {isLogging && isLogWithEmail && (
            <div>
              <ClipLoader color="white" size={10} className="ml-1" />
            </div>
          )}
        </button>
      </form>

      {/* Social login buttons */}
      <div className="flex flex-wrap justify-center w-full gap-4 mt-3">
        <button
          disabled={isLogging}
          onClick={() => handleLoginWithPopup(googleSignIn)}
          className="sign-btn"
        >
          Log in with
          <FcGoogle className="ml-2" size={24} />
        </button>
        <button
          disabled={isLogging}
          onClick={() => handleLoginWithPopup(githubSignIn)}
          className="sign-btn"
        >
          Log in with <FaGithub className="ml-2" size={24} />
        </button>
      </div>

      {/* The "OR" option */}
      <div className="flex items-center justify-center w-full mt-6">
        <span className="flex-grow mx-4 border-t border-black"></span>
        <span className="text-sm">OR</span>
        <span className="flex-grow mx-4 border-t border-black"></span>
      </div>

      <NavLink to="/sign-up" className="text-lg hover:underline">
        sign up
      </NavLink>
    </div>
  );
};

Login.propTypes = {
  emailLogin: PropTypes.func,
  googleSignIn: PropTypes.func,
  githubSignIn: PropTypes.func,
};

export default Login;
