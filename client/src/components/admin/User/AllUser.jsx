import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";
import "./AllUser.css";
import { Navbar } from "../../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
// import (Navigate)

export const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is admin
  const checkAdmin = async () => {
    try {
      const userRes = await fetch("http://localhost:3000/api/v1/user/profile", {
        credentials: "include",
      });
      const userData = await userRes.json();

      if (userData.user?.role !== "admin") {
        setIsAdmin(false);
        toast.error("Access denied! Admins only.");
        navigate("/")
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      toast.error("Failed to verify user role");
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/admin/see-users", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
    fetchAllUsers();
  }, []);

  const deleteUser = async (userId) => {
    if (!isAdmin) return toast.error("Unauthorized! Admins only.");

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("User deleted");
        fetchAllUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  const toggleSuspend = async (userId) => {
    if (!isAdmin) return toast.error("Unauthorized! Admins only.");

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/admin/update-isSuspended/${userId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("User status updated");
        fetchAllUsers();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating user status");
    }
  };

  const bidders = users.filter((user) => user.role === "bidder");
  const auctioneers = users.filter((user) => user.role === "auctioneer");

  if (loading) {
    return (
      <div className="loader-wrapper">
      <span className="main-loader"></span>
    </div>
    );
  }

  return (
    <div className="alluser-container">
        <Navbar/>
      <ToastContainer />
      <div className="container">
      <div className="alluser-stats">
        <h2>Total Users: {users.length}</h2>
        <h3>
          Bidders: {bidders.length} | Auctioneers: {auctioneers.length}
        </h3>
      </div>

      <div className="user-sections">
        {/* Bidders Section */}
        <div className="user-list">
          <h4>Bidders</h4>
          {bidders.map((user) => (
            <div key={user._id} className="user-card">
              <p>
                <strong>Name:</strong> {user.profilename}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {user.isSuspended ? "Suspended" : "Active"}
              </p>
              {isAdmin && (
                <div className="action-buttons">
                  <button onClick={() => deleteUser(user._id)}>
                    <FaTrash color="red" fontSize="20px" />
                  </button>
                  <button onClick={() => toggleSuspend(user._id)}>
                    {user.isSuspended ? (
                      <FaCheckCircle color="green" fontSize="20px" />
                    ) : (
                      <FaBan color="gray" fontSize="20px" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Auctioneers Section */}
        <div className="user-list">
          <h4>Auctioneers</h4>
          {auctioneers.map((user) => (
            <div key={user._id} className="user-card">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {user.isSuspended ? "Suspended" : "Active"}
              </p>
              {isAdmin && (
                <div className="action-buttons">
                  <button onClick={() => deleteUser(user._id)}>
                    <FaTrash color="red" fontSize="20px" />
                  </button>
                  
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};
