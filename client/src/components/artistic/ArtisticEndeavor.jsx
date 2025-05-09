import React from "react";
// import "./ArtisticEndeavor.css";
import artwork from "/img/artistic-img.webp"; // Replace with actual image path
import "./Artistic.css"

export const ArtisticEndeavor = () => {
  return (
    <div className="artistic">
    <div className="artistic-container container">
      <div className="image-section">
        <img src={artwork} alt="Artistic Endeavor" className="artwork-image" />
      </div>

      <div className="text-section">
        <h1>Our Artistic Endeavor</h1>
        <p>
          At Artmart, our mission is to revolutionize the art experience. We are committed to:
        </p>
        <ul>
          <li> <span> ➜</span> <strong>Empowering Artists</strong></li>
          <li><span> ➜</span> <strong>Connecting Collectors</strong></li>
          <li><span> ➜</span> <strong>Fostering Diversity</strong></li>
          <li><span> ➜</span> <strong>Ensuring Integrity</strong></li>
          <li><span> ➜</span> <strong>Building Community</strong></li>
        </ul>
        <p>
          We believe that art has the power to inspire, transform, and connect people. 
          Our goal is to bring this power to life by creating.
        </p>
      </div>
    </div>
    </div>
  );
};
