import React, { use } from "react";
import { Navbar } from "../Navbar/Navbar";
import { useState, useEffect } from "react";
import "./UpdateAccount.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UpdateAccount = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilename, setProfilename] = useState("");
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [profileimage, setProfileimage] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setInitialLoading(true); // ✅ Start loading
        const response = await fetch(
          "https://artmart-rr3n.onrender.com/api/v1/user/profile",
          {
            method: "GET",
            credentials: "include", // ✅ Send cookies
          }
        );

        if (response.ok) {
          setInitialLoading(false); // ✅ Stop loading
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault(); // ✅ Prevent form reload
    try {
      setUpdateLoading(true); // ✅ Start loading
      const formData = new FormData();
      formData.append("profileImage", profileimage);
      formData.append("profilename", profilename);
      // formData.append("username", username);
      // formData.append("email", email);
      // formData.append("password", password);
      formData.append("phone", phone);
      formData.append("address", address);

      const response = await fetch(
        "https://artmart-rr3n.onrender.com/api/v1/user/profile/update",
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (response.status === 404) {
        setUpdateLoading(false); // ✅ Stop loading
        toast.error("User not found", {
          position: "top-right",
          autoClose: 4000,
        });
      }
      if (response.status === 405) {
        setUpdateLoading(false); // ✅ Stop loading
        toast.error("image file format is not valid", {
          position: "top-right",
          autoClose: 4000,
        });
      }

      if (response.ok) {
        setUpdateLoading(false); // ✅ Stop loading
        toast.success("Account updated successfully");
        setTimeout(() => {
          navigate("/myaccount");
        }, 2000);
      } else {
        setUpdateLoading(false); // ✅ Stop loading
        toast.error("Failed to update account", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      setUpdateLoading(false); // ✅ Stop loading
      toast.error("Something went wrong. Try again.")
      console.log(error);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      setPasswordLoading(true); // ✅ Start loading
      const response = await fetch(
        "https://artmart-rr3n.onrender.com/api/v1/user/password/update",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json", // ✅ Send JSON data
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 400) {
        setPasswordLoading(false); // ✅ Stop loading
        toast.error(data.message || "Invalid request");
        return;
      }
      if (response.status === 404) {
        setPasswordLoading(false); // ✅ Stop loading
        toast.error(data.message || "User not found");
        return;
      }

      if (response.ok) {
        setPasswordLoading(false); // ✅ Stop loading
        toast.success("Password changed successfully");
        setTimeout(() => navigate("/myaccount"), 2000);
      }
    } catch (error) {
      setPasswordLoading(false); // ✅ Stop loading
      console.error("Error:", error);
      toast.error("Something went wrong. Try again.");
    }
  };


  if (initialLoading) {
    return (
      <div className="loader-wrapper">
      <span className="main-loader"></span>
    </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={4000} />{" "}
      {/* ✅ Always present */}
      {isAuthenticated ? (
        <div className="update-acc">
          <div className="container">
            <div className="update-acc-content">
              <div className="update-details">
                <h1>Update Account Details</h1>
                <form onSubmit={handleUpdate}>
                  <div className="profileimage-reg">
                    <label className="prof-img-label">Profile Image</label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileimage(e.target.files[0])}
                    />
                  </div>

                  <div className="profilename-reg">
                    <label>Profile Name *</label>
                    <input
                      type="text"
                      value={profilename}
                      onChange={(e) => setProfilename(e.target.value)}
                    />
                  </div>

                  <div className="phone-reg">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="address-reg">
                    <label>Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <span className="loader"></span>
                    ) : (
                      "Update Details"
                    )}
                  </button>
                </form>
              </div>
              <div className="change-password">
                <h1>Change Password</h1>
                <form onSubmit={changePassword}>
                  <div className="old-password">
                    <label className="old-pass-label">Old Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      // required
                    />
                  </div>

                  <div className="new-password">
                    <label className="new-pass-label">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      // required
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <span className="loader"></span>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
