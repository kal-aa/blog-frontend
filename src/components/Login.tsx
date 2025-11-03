import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaGithub, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LoginProps, ProvidersData } from "../types/auth";
import { AuthLoader } from "./AuthLoader";

const Login = ({ emailLogin, googleSignin, githubSignin }: LoginProps) => {
  const [isLogging, setIsLogging] = useState(false);
  const [loggingMethod, setLoggingMethod] = useState<
    "email" | "google" | "github" | null
  >(null);

  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPasswordError("");
    setError("");

    if (formData.password.length < 8) {
      setPasswordError("Password must be greater than 8 characters");
      return;
    }

    try {
      setIsLogging(true);
      setLoggingMethod("email");
      await emailLogin(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogging(false);
      setLoggingMethod(null);
    }
  };

  const handleLoginWithPopup = async (
    method: () => Promise<void>,
    provider: "google" | "github"
  ) => {
    try {
      setIsLogging(true);
      setLoggingMethod(provider);
      await method();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogging(false);
      setLoggingMethod(null);
    }
  };

  const providers: ProvidersData[] = [
    {
      name: "google",
      icon: <FcGoogle className="mx-2" size={24} />,
      method: googleSignin,
    },
    {
      name: "github",
      icon: <FaGithub className="mx-2" size={24} />,
      method: githubSignin,
    },
  ];

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
          <span className="mr-2">Submit</span>
          <AuthLoader active={loggingMethod === "email"} />
        </button>
      </form>

      {/* Social login buttons */}
      <div className="flex flex-wrap justify-center w-full gap-4 mt-3">
        {providers.map((p) => (
          <button
            key={p.name}
            className="sign-btn"
            disabled={isLogging}
            onClick={() => handleLoginWithPopup(p.method, p.name)}
          >
            Log in with {p.icon}
            <AuthLoader active={loggingMethod === p.name} color="black" />
          </button>
        ))}
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

export default Login;
