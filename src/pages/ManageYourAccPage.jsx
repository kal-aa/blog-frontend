import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import ManageYourAcc from "../components/ManageYourAcc";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ManageYourAccPage = () => {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [data, setData] = useState({});
  const [password, setPassword] = useState(""); // the mini authentication's password
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

  //  for the mini Authentication
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setPasswordError("Must be greater than 8 characters");
      setTimeout(() => {
        setPasswordError("");
      }, 3000);
      return;
    }

    const url = `http://localhost:5000/manage-account-password/${id}?password=${encodeURIComponent(
      password
    )}`;
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
        setData(data);
      })
      .catch((error) => {
        console.error("Error comparing password", error);
      });
  };

  //  fill the form
  useEffect(() => {
    if (data) {
      setFormdata({
        name: data.name || "",
        email: data.email || "",
        password: data.password || "",
        confirmPassword: data.password || "",
      });
    }
  }, [data]);

  //  update and delete
  const handleManageSubmit = (e) => {
    e.preventDefault();

    const actionType = e.nativeEvent.submitter.name;
    if (actionType === "delete") {
      const confirm = window.confirm(
        "Are you sure you want to delete your user data?"
      );

      const url = `http://localhost:5000/manage-account-delete/${id}`;
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
    } else if (actionType === "update") {
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

      const updateUrl = `http://localhost:5000/manage-account-update/${id}`;
      const updateData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      setIsUpdating(true);
      fetch(updateUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
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
          console.log("Client data updated successfully");
        })
        .catch((error) => {
          setIsUpdating(false);
          console.error("Error updating client data", error);
        });
    }
  };

  return (
    <>
      <Header />
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
        }}
        isFullName={isFullName}
        fullNameRef={fullNameRef}
      />
    </>
  );
};

export default ManageYourAccPage;
