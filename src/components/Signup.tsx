import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaCheck, FaGithub, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import ClipLoader from "react-spinners/ClipLoader";
import { NavLink } from "react-router-dom";
import { ProvidersData, SignupProps } from "../types/auth";
import { AuthLoader } from "./AuthLoader";

const Signup = ({ emailSignup, googleSignup, githubSignup }: SignupProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatched, setPasswordMatched] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signingMethod, setSigningMethod] = useState<
    "email" | "github" | "google" | null
  >(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Show check icon when password and confirmPassword match
  useEffect(() => {
    if (
      formData.password === formData.confirmPassword &&
      formData.password.length > 7 &&
      !formData.password.includes(" ")
    ) {
      setIsPasswordConfirmed(true);
    } else {
      setIsPasswordConfirmed(false);
    }
  }, [formData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMatched("");

    if (formData.password.length < 8)
      return setPasswordMatched("Password must be greater than 8 characters");
    if (formData.password !== formData.confirmPassword)
      return setPasswordMatched("Password does not match");

    try {
      setIsSigning(true);
      setSigningMethod("email");
      await emailSignup(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigning(false);
      setSigningMethod(null);
    }
  };

  const handleSigninWithPopup = async (
    method: () => Promise<void>,
    provider: "github" | "google"
  ) => {
    try {
      setIsSigning(true);
      setSigningMethod(provider);
      await method();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigning(false);
      setSigningMethod(null);
    }
  };

  const providers: ProvidersData[] = [
    {
      name: "google",
      icon: <FcGoogle className="mx-2" size={24} />,
      method: googleSignup,
    },
    {
      name: "github",
      icon: <FaGithub className="mx-2" size={24} />,
      method: githubSignup,
    },
  ];

  return (
    <div className="relative signup-container">
      <h1 className="text-3xl font-bold">Welcome</h1>
      {/* signup form */}
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
            disabled={isSigning}
            className="input-style"
          />
        </label>

        <label htmlFor="password" className="relative">
          Password:
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            disabled={isSigning}
            className="input-style"
          />
          <FaLock className="lock-style" />
        </label>

        <label htmlFor="confirmPassword" className="relative">
          Confirm Password:
          {isPasswordConfirmed && <FaCheck className="inline mb-0.5" />}
          <p className="inline-block text-sm text-red-600">{passwordMatched}</p>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm password"
            disabled={isSigning}
            className="input-style"
          />
          <FaLock className="lock-style" />
        </label>

        <button
          type="submit"
          disabled={isSigning}
          className="sign-btn !w-full bg-black text-white disabled:bg-black/50 mt-5"
        >
          <span>submit</span>
          <AuthLoader active={signingMethod === "email"} />
        </button>
      </form>

      {/* Social signup buttons */}
      <div className="flex flex-wrap justify-center w-full gap-4 mt-3">
        {providers.map((p) => (
          <button
            key={p.name}
            className="sign-btn"
            onClick={() => handleSigninWithPopup(p.method, p.name)}
          >
            Sign up with {p.icon}
            <AuthLoader active={signingMethod === p.name} color="black" />
          </button>
        ))}{" "}
      </div>
      {/* the "OR" option */}
      <div className="flex items-center justify-center w-full mt-6">
        <span className="flex-grow mx-4 border-t border-black"></span>
        <span className="text-sm">OR</span>
        <span className="flex-grow mx-4 border-t border-black"></span>
      </div>
      <NavLink to="/log-in" className="hover:underline">
        Log in
      </NavLink>
    </div>
  );
};

export default Signup;
