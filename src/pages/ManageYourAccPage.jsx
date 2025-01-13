import { useEffect, useRef, useState } from "react";
import ManageYourAcc from "../components/ManageYourAcc";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ManageYourAccPage = () => {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [data, setData] = useState({});
  const [password, setPassword] = useState(""); // password from the mini authunticatin form
  const [isFullName, setIsFullName] = useState(true);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false); // The mini authentication's confirm
  const [passwordError, setPasswordError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [badManageRequest, setBadManageRequest] = useState("");
  const navigate = useNavigate();
  const fullNameRef = useRef(null);
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  // hanlde the input img
  const handleImageUpload = (e, setPreview) => {
    const image = e.target.files[0];
    setFormdata((prevFormData) => ({
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

  //  for the mini Authentication
  const handlePasswordSubmit = (e, setIsCheckingPassword) => {
    e.preventDefault();

    if (password.length < 8) {
      setPasswordError("Must be greater than 8 characters");
      setTimeout(() => {
        setPasswordError("");
      }, 3000);
      return;
    }

    const url = `https://blog-backend-sandy-three.vercel.app/manage-account-password/${id}?password=${encodeURIComponent(
      password
    )}`;
    setIsCheckingPassword(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            setPasswordError(error.mssg);
            setTimeout(() => {
              setPasswordError("");
            }, 3000);
            throw new Error(error.mssg);
          });
        }
        setIsPasswordConfirmed(true);
        return res.json();
      })
      .then((data) => {
        setIsCheckingPassword(false);
        setData(data);
      })
      .catch((error) => {
        setIsCheckingPassword(false);
        console.error("Error comparing password", error);
      });
  };

  //  fill the form with the data from db
  useEffect(() => {
    if (data) {
      const image =
        data.buffer && data.mimetype
          ? `data:${data.mimetype};base64,${data.buffer}`
          : "";
      setFormdata({
        name: data.name || "",
        email: data.email || "",
        password: data.password || "",
        confirmPassword: data.password || "",
        image,
      });
    }
  }, [data]);

  //  update and delete
  const handleManageSubmit = (e) => {
    e.preventDefault();
    const actionType = e.nativeEvent.submitter.name;

    // Delete
    if (actionType === "delete") {
      const confirm = window.confirm(
        "Are you sure you want to delete your user data?"
      );

      const url = `https://blog-backend-sandy-three.vercel.app/manage-account-delete/${id}`;
      if (confirm) {
        setIsDeleting(true);
        fetch(url, { method: "DELETE" })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((error) => {
                setBadManageRequest(error.mssg);
                setTimeout(() => {
                  setBadManageRequest("");
                }, 3000);
                throw new Error(error.mssg);
              });
            }

            setIsDeleting(false);
            navigate("/");
            console.log("Client deleted successfully");
          })
          .catch((error) => {
            setIsDeleting(false);
            console.error("Error deleting client", error);
          });
      }
    }

    // Update
    if (actionType === "update") {
      const checkFullName = formData.name.trim().split(" ");
      if (checkFullName.length !== 2) {
        setIsFullName(false);
        setTimeout(() => {
          setIsFullName(true);
        }, 3000);
        fullNameRef.current.click();
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setPasswordError("password does not match");
        setTimeout(() => {
          setPasswordError("");
        }, 3000);
        return;
      }

      const updateUrl = `https://blog-backend-sandy-three.vercel.app/manage-account-update/${id}`;
      const updateData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const submissionDataWithFile = new FormData();
      Object.keys(updateData).map((key) => {
        submissionDataWithFile.append(key, updateData[key]);
      });

      if (formData.image !== `data:${data.mimetype};base64,${data.buffer}`) {
        submissionDataWithFile.append("image", formData.image);
      }

      setIsUpdating(true);
      fetch(updateUrl, {
        method: "PATCH",
        body: submissionDataWithFile,
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((error) => {
              setBadManageRequest(error.mssg);
              setTimeout(() => {
                setBadManageRequest("");
              }, 10000);
              throw new Error("Error updating client data", error.mssg);
            });
          }
          //  already up-to-date
          if (res.status === 200) {
            return res.json().then((response) => {
              setBadManageRequest(response.mssg);
              setTimeout(() => {
                setBadManageRequest("");
              }, 5000);
              setIsUpdating(false);
            });
          }

          setIsUpdating(false);
          toast("Updated successfully!");
          // navigate(`/home/${id}`);
        })
        .catch((error) => {
          setIsUpdating(false);
          console.error("Error updating client data", error);
        });
    }
  };

  return (
    <ManageYourAcc
      formData={formData}
      passwordProps={{
        password,
        setPassword,
        passwordError,
        isPasswordConfirmed,
      }}
      manageProps={{
        isUpdating,
        isDeleting,
        badManageRequest,
        handleChange,
        handlePasswordSubmit,
        handleManageSubmit,
        data,
      }}
      data={data}
      isFullName={isFullName}
      fullNameRef={fullNameRef}
      handleImageUpload={handleImageUpload}
    />
  );
};

export default ManageYourAccPage;
