import React, { useEffect, useState } from "react";
import "./ArtBanner.css";

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

export const ArtBannerTwo = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch images for each category
  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages = [];
      for (const category of categories) {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${category}+art&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            fetchedImages.push({
              url: data.results[0].urls.regular,
              category,
            });
          }
        } catch (error) {
          console.error("Error fetching image for", category, error);
        }
      }
      setImages(fetchedImages);
    };

    fetchImages();
  }, []);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        images.length > 0 ? (prevIndex + 1) % images.length : 0
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  const currentImage = images[currentIndex];


  return (
    <div
      className="art-banner"
      style={{
        backgroundImage: `url(${currentImage?.url || ""})`,
      }}
    >
      <div className="overlay">
        <div className="text-box">
          <h1>Art Catalog</h1>
          <p>
            An art catalog is a curated assembly of artworks gathered by an
            individual, institution, or group, often reflecting the collector's
            interests, tastes, or a specific theme.
          </p>
          {currentImage && <span className="category-tag">{currentImage.category}</span>}
        </div>
      </div>
    </div>
  );
};
