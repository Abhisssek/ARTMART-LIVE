import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [role, setRole] = useState(null);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.user?.role) {
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/get-notification",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/delete-notification/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  return (
    <div className="nav">
      <div className="container">
        <div className="navbar">
          <div className="nav-logo">
            <Link to="/">
              <h1>Artmart</h1>
            </Link>
          </div>

          {/* Hamburger Icon */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            ref={hamburgerRef}
          >
            ☰
          </div>

          {/* Navigation Links */}
          <div
            className={`nav-links ${menuOpen ? "open" : ""}`}
            ref={menuRef}
          >
            <ul>
              <Link to="/all-auctions">
                <li onClick={() => setMenuOpen(false)}>Auctions</li>
              </Link>
              <Link to="/category">
                <li onClick={() => setMenuOpen(false)}>Categories</li>
              </Link>
              <Link to="/contact-page">
                <li onClick={() => setMenuOpen(false)}>Contact</li>
              </Link>
              <Link to="/announcement">
                <li onClick={() => setMenuOpen(false)}>Announcement</li>
              </Link>
              {role === "bidder" && (
                <div className="notification-icon" onClick={togglePopup}>
                  <span className="notification-badge">
                    {unreadCount > 0 ? unreadCount : ""}
                  </span>
                  🔔
                </div>
              )}
            </ul>

            <div className="nav-logs">
              <Link to="/myaccount">
                <button
                  className="my-acc-btn primary-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  My Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {popupOpen && (
        <div className="notification-popup">
          <div className="popup-header">
            <span>Notifications</span>
            <button className="close-btn" onClick={togglePopup}>
              X
            </button>
          </div>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li key={notification._id} className="notification-item">
                  <span>{notification.message}</span>
                  <button
                    className="notifi-delete-btn"
                    onClick={() => handleDelete(notification._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
