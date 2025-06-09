import { useEffect, useRef, useState } from "react";
import { FaCheck, FaLock, FaPlus } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import NoInternetConnection from "./NoInternetConnection";

const Signup = ({ signupSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [passwordMatched, setPasswordMatched] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isFullName, setIssFullName] = useState(true);
  const [error, setError] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [preview, setPreview] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const fullnameRef = useRef(null);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      image,
    }));
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(
        import.meta.env.VITE_PUBLIC_URL + "assets/images/unknown-user.jpg"
      );
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    } else {
      setIsOnline(true);
    }

    setIssFullName(true);
    setPasswordMatched("");

    const name = formData.name;
    const fullName = name.trim().split(" ");

    if (fullName.length !== 2) {
      fullnameRef.current.click();
      setIssFullName(false);
      return;
    } else if (formData.password.length < 8) {
      setPasswordMatched("Password must be greater than 8 characters");
    } else if (formData.password !== formData.confirmPassword) {
      setPasswordMatched("Password does not match");
      return;
    } else {
      signupSubmit(formData, setError, setIsSigning);
    }
  };

  return (
    <div className="relative signupContainer">
      {!isOnline && <NoInternetConnection />}

      <div className={error ? "errorStyle" : undefined}>{error}</div>
      <h1 className="text-3xl font-bold">Welcome</h1>

      {/* signup form */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleImageUpload}
          />
          <label htmlFor="fileInput" className="relative">
            <img
              src={
                preview ||
                import.meta.env.VITE_PUBLIC_URL +
                  "assets/images/unknown-user.jpg"
              }
              alt="user"
              className="inline w-20 h-20 border border-red-300 rounded-full cursor-pointer"
              title="Click to upload image"
            />
            {!preview && (
              <FaPlus className="absolute text-5xl text-white opacity-25 right-4 bottom-4" />
            )}
          </label>
        </div>
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

        <label ref={fullnameRef} htmlFor="name">
          Full-name:
          {!isFullName && (
            <p className="inline-block ml-1 text-sm text-red-600">
              Insert first and last name
            </p>
          )}
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="E.g. Kalab Sisay"
          className="inputStyle"
        />

        <label htmlFor="password">Password:</label>
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
        <label htmlFor="confirmPassword">
          Confirm Password:
          {isPasswordConfirmed && <FaCheck className="inline mb-0.5" />}
          <p className="inline-block text-sm text-red-600">{passwordMatched}</p>
        </label>
        <div className="relative">
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Enter password"
            className="inputStyle"
          />
          <FaLock className="lockStyle" />
        </div>
        <button
          disabled={isSigning}
          className={`w-full rounded-md bg-black text-white py-2 mt-2 ${
            !isSigning && "hover:scale-105"
          } transition-all duration-200 ease-out `}
        >
          {isSigning ? (
            <div>
              <span>submit</span>
              <ClipLoader color="white" size={10} className="ml-1" />
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>

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

Signup.propTypes = {
  signupSubmit: PropTypes.func,
};

export default Signup;
