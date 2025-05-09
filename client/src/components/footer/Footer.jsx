import React from "react";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          {/* Left Section */}
          <div className="footer-left">
            <h2>Artmart</h2>
            <p>
              An Art Action Company typically operates in the space of live art,
              performance, and social practice, often combining elements of
              activism and community engagement.
            </p>
            <div className="social-icons">
              <a href="#" className="icon">
                🔗 Linkedin
              </a>
              <a href="#" className="icon">
                📘 Facebook
              </a>
              <a href="#" className="icon">
                ✖ Twitter
              </a>
              <a href="#" className="icon">
                📷 Instagram
              </a>
            </div>
          </div>

          {/* Middle Section */}
          <div className="footer-main-middle">
            <div className="footer-middle">
              <h3>Menu</h3>
              <ul>
                <li>
                  <a href="#">Artists Portfolio</a>
                </li>
                <li>
                  <a href="#">Art Catalog</a>
                </li>
                <li>
                  <a href="#">Departments</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-middle">
              <h3>Resources</h3>
              <ul>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">How to Bid</a>
                </li>
                <li>
                  <a href="#">How to Sell</a>
                </li>
                <li>
                  <a href="#">F.A.Q</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
        </div>
      </div>
      
    </footer>
  );
};
