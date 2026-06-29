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
        <div className="carousel-item">
  <img
    src="/img/af4bb7662179f9d7ba691f831a88189d.jpg"
    className="d-block w-100"
    
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
