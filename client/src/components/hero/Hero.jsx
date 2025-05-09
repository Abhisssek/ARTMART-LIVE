import React from "react";
import "./Hero.css";

export const Hero = () => {
  return (
    <div className="hero">
       <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      {/* Carousel Inner */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://artmart-wp.b-cdn.net/wp-content/uploads/2024/12/hero-banner-1.webp"
            className="d-block"
            alt="Slide 1"
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://artmart-wp.b-cdn.net/wp-content/uploads/2024/12/hero-banner-2.webp"
            className="d-block"
            alt="Slide 2"
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://artmart-wp.b-cdn.net/wp-content/uploads/2024/12/hero-banner-3.webp"
            className="d-block"
            alt="Slide 3"
          />
        </div>
      </div>

      {/* Carousel Controls */}
      
    </div>
      <div className="container">
        <div className="hero-text"> 
        <h1>Art That Speaks To Your Soul</h1>
        <h3>Unlock a world of imagination with our curated collection of original artworks. From bold abstracts to serene landscapes, discover pieces that inspire, captivate.</h3>
        <button className="primary-btn">Explore Now</button>
        </div>
      </div>
    </div>
  );
};
