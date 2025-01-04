import { useEffect, useRef, useState } from "react";
import { FaCheck, FaLock, FaPlus } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

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
  const [isItFullName, setisIsFullName] = useState(true);
  const [error, setError] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [preview, setPreview] = useState("");
  const fullnameRef = useRef(null);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e, setFormData, setPreview) => {
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
      setPreview("/assets/images/unknown-user.jpg");
    }
  };

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

    const name = formData.name;
    const fullName = name.trim().split(" ");

    if (fullName.length !== 2) {
      fullnameRef.current.click();
      setisIsFullName(false);
      setTimeout(() => {
        setisIsFullName(true);
      }, 4000);
      return;
    } else if (formData.password.length < 8) {
      setPasswordMatched("Password must be greater than 8 characters");
      setTimeout(() => {
        setPasswordMatched("");
      }, 4000);
    } else if (formData.password !== formData.confirmPassword) {
      setPasswordMatched("Password does not match");
      setTimeout(() => {
        setPasswordMatched("");
      }, 4000);
      return;
    } else {
      signupSubmit(formData, setError, setIsSigning);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen px-[10%] sm:px-[20%] md:px-[25%] lg:px-[30%] -mt-20">
        <div
          className={
            error &&
            "flex justify-center items-center text-center border-l-8 border-red-500 px-2 rounded-xl text-red-600 border w-full h-20"
          }
        >
          {error}
        </div>
        <h1 className="text-3xl font-bold">Welcome</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-center items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={(e) => handleImageUpload(e, setFormData, setPreview)}
            />
            <label htmlFor="fileInput" className="relative">
              <img
                src={preview || "/assets/images/unknown-user.jpg"}
                alt="user"
                className="inline w-20 h-20 border border-red-300 rounded-full cursor-pointer"
                title="Click to upload image"
              />
              {!preview && (
                <FaPlus className="absolute right-3 bottom-3 opacity-25 text-6xl text-red-500" />
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
            {!isItFullName && (
              <p className="text-red-600 text-sm inline-block ml-1">
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
            <p className="text-red-600 text-sm inline-block">
              {passwordMatched}
            </p>
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
            } transition-all duration-200 ease-out`}
          >
            {isSigning ? "Submitting..." : "Submit"}
            {isSigning && (
              <ClipLoader color="white" size={10} className="ml-1" />
            )}
          </button>
        </form>
        <div className="w-full flex items-center justify-center mt-6">
          <span className="flex-grow border-t border-black mx-4"></span>
          <span className="text-sm">OR</span>
          <span className="flex-grow border-t border-black mx-4"></span>
        </div>
        <NavLink to="/log-in" className="hover:underline">
          Log in
        </NavLink>
      </div>
    </>
  );
};

Signup.propTypes = {
  signupSubmit: PropTypes.func,
};

export default Signup;
