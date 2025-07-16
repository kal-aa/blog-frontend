import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, onAuthStateChanged } from "firebase/auth";
import ClipLoader from "react-spinners/ClipLoader";
import { useUser } from "../context/UserContext";
import { auth } from "../config/firebase";

const CompleteProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isuserLoading, setIsUserLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullnameRef = useRef(null);
  const navigate = useNavigate();
  const { setUser: contextUser } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !firebaseUser.emailVerified) {
        setUser(null);
        setError(
          "This email is not verified yet. Redirecting to verification page..."
        );
        setTimeout(() => {
          navigate("/verify-email");
        }, 3000);
        return;
      } else {
        setUser(firebaseUser);
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [navigate]);

  useEffect(() => {
    if (!isuserLoading && !user) {
      setError("No user session found. Redirecting to sign-up...");
      setTimeout(() => navigate("/sign-up"), 3000);
    }
  }, [user, isuserLoading, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = name.trim().split(" ");

    if (fullName.length !== 2) {
      fullnameRef.current.focus();
      setError("Please prvide your full name: 'John Doe'");
      return;
    }

    try {
      setIsSubmitting(true);
      const idToken = await user.getIdToken();

      const formData = new FormData();
      formData.append("name", name);
      image && formData.append("image", image);

      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        console.error("Signup failed with status:", res.status);
        const { mssg } = await res.json();
        setError(mssg || "Signup failed");

        await deleteUser(user);
        throw new Error(mssg);
      }

      const { id, name: name2 } = await res.json();
      contextUser({ id, name: name2 });

      const trim = name2.trim().split(" ")[0];
      const firstName = trim.charAt(0).toUpperCase() + trim.slice(1) || "User";

      navigate(`/home?signerName=${firstName}`);
    } catch (err) {
      console.error("Error completing profile:", err);
      setError(err.message || "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto mt-12 text-center border shadow-md rounded-xl">
      <h2 className="mb-4 text-2xl font-bold">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleImageUpload}
            disabled={isSubmitting}
          />
          <label htmlFor="fileInput">
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
          </label>
          {image && (
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview("");
              }}
              className="text-xs text-red-500 underline md:text-sm hover:text-red-700"
            >
              Remove Image
            </button>
          )}
        </div>

        {error && (
          <p className="px-4 py-2 mb-4 text-sm text-blue-700 bg-blue-200 rounded">
            {error}
          </p>
        )}

        <input
          ref={fullnameRef}
          type="text"
          name="name"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
          className="input-style"
        />

        <button
          type="submit"
          disabled={isSubmitting || !user}
          className="w-full py-2 text-white transition bg-black rounded hover:bg-black/80 disabled:opacity-50 disabled:hover:bg-black"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span>Submitting</span> <ClipLoader size={15} color="white" />
            </span>
          ) : (
            "Submit Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
