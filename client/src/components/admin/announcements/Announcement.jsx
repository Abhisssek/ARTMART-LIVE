import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Announcements.css";
import { Navbar } from "../../Navbar/Navbar";
import { Footer } from "../../footer/Footer";

const categories = [
  "Old Masters",
  "Contemporary Art",
  "Impressionist & Modern Art",
  "Post-War & Contemporary",
  "Asian Art",
  "European Paintings",
  "Antique Furniture & Decorative Arts",
  "Jewelry & Watches",
  "Sculpture",
  "Photography",
  "Prints & Multiples",
  "African & Oceanic Art",
];

const UNSPLASH_ACCESS_KEY = "zbd96SUK0XbjBbZOpYUFIP4VnFkRH0lm79fsX00oosg";

export const Announcement = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/profile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUserRole(data.user.role);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/user/get-announcements",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      } catch (err) {
        console.error("Error fetching announcements:", err.message);
      }
    };

    const fetchImages = async () => {
      const fetchedImages = [];
      for (const category of categories) {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${category}+art&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
          );
          const data = await res.json();
          if (data.results.length > 0) {
            fetchedImages.push(data.results[0].urls.regular);
          }
        } catch (err) {
          console.error("Image fetch failed for", category);
        }
      }
      setImages(fetchedImages);
    };

    fetchProfile();
    fetchAnnouncements();
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    const { title, description } = newAnnouncement;
    if (!title || !description) return;

    try {
      setButtonLoading(true);
      const res = await fetch(
        "http://localhost:3000/api/v1/admin/make-announcement",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, description }),
        }
      );

      if (!res.ok) throw new Error("Failed to create announcement");
      setButtonLoading(false);

      setNewAnnouncement({ title: "", description: "" });
      const updated = await res.json();
      setAnnouncements((prev) => [updated.announcement, ...prev]);
    } catch (err) {
      console.error("Create announcement error:", err.message);
    }
  };

  if (loading)
    return (
      <div className="loader-wrapper">
        <span className="main-loader"></span>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="announcement-wrapper">
        {/* Admin Create Form */}
        {userRole === "admin" && (
          <motion.div
            className="announcement-create-box"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Create Announcement</h2>
            <form onSubmit={handleCreateAnnouncement}>
              <input
                type="text"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    title: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={newAnnouncement.description}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    description: e.target.value,
                  })
                }
                rows={4}
                required
              />
              <button
                type="submit"
                className="btn btn-success"
                disabled={buttonLoading}
              >
                {buttonLoading ? (
                  <span className="loader"></span>
                ) : (
                  "Post Announcement"
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Banner Announcement */}
        {announcements[0] && images.length > 0 && (
          <div
            className="announcement-banner"
            style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
          >
            <motion.div
              className="banner-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentImageIndex}
            >
              <h1>{announcements[0].title}</h1>
              <p>{announcements[0].description}</p>
              <p>{new Date(announcements[0].date).toLocaleString()}</p>
            </motion.div>
          </div>
        )}

        {/* Grid Announcements (from 2nd onward) */}
        <div className="announcement-grid">
          {announcements.slice(1).map((announcement, i) => (
            <motion.div
              key={i}
              className="announcement-card"
              style={{ backgroundImage: `url(${images[i + 1]})` }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="card-overlay">
                <h3>{announcement.title}</h3>
                <p>{announcement.description}</p>
                <p className="announcement-meta">
                  {new Date(announcement.date).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};
