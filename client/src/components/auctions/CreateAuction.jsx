import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateAuction.css"; // Import the CSS file
import { Navbar } from "../Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";

export const CreateAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingBid: "",
    category: "",
    condition: "",
    artcreater: "",
    artstyle: "",
    artmadedate: "",
    startTime: "",
    endingTime: "",
    images: [], // ✅ Changed from `image` to `images` (array)
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        images: Array.from(files), // ✅ Convert FileList to an array
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          formDataToSend.append(key, value);
        }
      });

      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch("https://artmart-rr3n.onrender.com/api/v1/auction/new", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        toast.error(data.msg || "Failed to create auction");
        setLoading(false);
        return;
      }

      toast.success("Auction created successfully!");
      setTimeout(() => {
        setLoading(false);
        navigate("/my-auctions");
      }, 4000);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const categories = [
    "Renaissance",
    "Romanticism",
    "Impressionism",
    "Surrealism",
    "Abstract",
    "Baroque",
    "Modern",
    "Contemporary",
    "Cubism",
    "Pop Art",
  ];

  return (
    <div className="create-auction">
      <ToastContainer position="top-right" autoClose={4000} />
      <Navbar />
      <div className="auction-container">
        <h2>Create New Auction</h2>
        <form
          onSubmit={handleSubmit}
          className="auction-form"
          encType="multipart/form-data"
        >
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="startingBid">Starting Price</label>
          <input
            type="number"
            id="startingBid"
            name="startingBid"
            placeholder="Enter starting price"
            value={formData.startingBid}
            onChange={handleChange}
            required
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>

          <label htmlFor="artcreater">Art Creator</label>
          <input
            type="text"
            id="artcreater"
            name="artcreater"
            placeholder="Enter artist name"
            value={formData.artcreater}
            onChange={handleChange}
            required
          />

          <label htmlFor="artstyle">Art Style</label>
          <input
            type="text"
            id="artstyle"
            name="artstyle"
            placeholder="Enter art style"
            value={formData.artstyle}
            onChange={handleChange}
            required
          />

          <label htmlFor="artmadedate">Art Created Date</label>
          <input
            type="date"
            id="artmadedate"
            name="artmadedate"
            value={formData.artmadedate}
            onChange={handleChange}
            required
          />

          <label htmlFor="startTime">Auction Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />

          <label htmlFor="endingTime">Auction End Time</label>
          <input
            type="datetime-local"
            id="endingTime"
            name="endingTime"
            value={formData.endingTime}
            onChange={handleChange}
            required
          />

          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple // ✅ Allow multiple file selection
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? <span className="loader"></span> : "Create Auction"}
          </button>
        </form>
      </div>
    </div>
  );
};
