import React from "react";
// import "./DiscoverSection.css";
import leftImage from "/img/discover-img-left.webp"; // Replace with actual path
import rightImage from "/img/discover-img-right.webp"; // Replace with actual path
import { Link } from "react-router-dom";
import "./Discover.css";

export const DiscoverSection = () => {
  return (
    <div className="discover">
      <div className="container-3 ">
        <div className="discover-container">
          <div className="discover-left">
            <div className="discover-left-content">
              <img src={leftImage} alt="Left Artwork" className="left-image" />

              <div className="content">
                <h1>Discover Our Essence</h1>
                <p>
                  At Artmart, we are passionate art enthusiasts dedicated to
                  connecting artists and collectors through dynamic and exciting
                  auctions. Our platform celebrates the creativity and diversity
                  of artists from around the world, providing a space where
                  their works can be appreciated and acquired by:
                </p>
                <ul>
                  <li>
                    ✔️ <strong>Integrity</strong>
                  </li>
                  <li>
                    ✔️ <strong>Diversity</strong>
                  </li>
                  <li>
                    ✔️ <strong>Accessibility</strong>
                  </li>
                  <li>
                    ✔️ <strong>Enthusiasts</strong>
                  </li>
                  <li>
                    ✔️ <strong>Collectors</strong>
                  </li>
                  <li>
                    ✔️ <strong>Support</strong>
                  </li>
                </ul>
              </div>
              
            </div>
            <div className="stats-bar">
                <div className="stat">
                  <h3>65K</h3>
                  <p>Customers</p>
                </div>
                <div className="stat">
                  <h3>1.5K</h3>
                  <p>Collections</p>
                </div>
                <div className="stat">
                  <h3>800</h3>
                  <p>Auctions</p>
                </div>
                <div className="stat">
                  <h3>1K</h3>
                  <p>Bidders</p>
                </div>
              </div>
          </div>

          <div className="right-image-container">
            <img src={rightImage} alt="Right Artwork" className="right-image" />
            <button className="learn-more">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};
