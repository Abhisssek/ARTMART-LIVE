import React from "react";
import "./Special.css";
import specialImage from "/img/special-img.webp"; // Replace with actual path

export const SpecialSection = () => {
  return (
    <div className="special-container">
      <div className="special-image-section">
        <img src={specialImage} alt="Artistic Pieces" className="special-image" />
      </div>

      <div className="special-text-section">
        <h1>What Makes Us Special</h1>
        <p>
          An unparalleled art auction experience where quality, integrity, and passion for art come together.
        </p>

        <div className="special-grid">
          <div className="special-grid-item">
            <span>🎨</span>
            <h3>Support Artists</h3>
            <p>Supporting their creative endeavors as they continue to produce extraordinary works.</p>
          </div>

          <div className="special-grid-item">
            <span>🔒</span>
            <h3>Secure Transactions</h3>
            <p>Ensuring safe and transparent transactions for all users.</p>
          </div>

          <div className="special-grid-item">
            <span>⚡</span>
            <h3>Seamless Experience</h3>
            <p>Providing a smooth and user-friendly interface for art lovers.</p>
          </div>

          <div className="special-grid-item">
            <span>💻</span>
            <h3>User-Friendly Platform</h3>
            <p>Designed to be intuitive and accessible for everyone.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
