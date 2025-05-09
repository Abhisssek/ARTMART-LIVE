import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import {Navbar} from "../navbar/Navbar";
import { Footer } from "../footer/Footer";
import { ArtBanner } from "../extra component/ArtBanner";

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

export const Category = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState({});

  const UNSPLASH_ACCESS_KEY = "zbd96SUK0XbjBbZOpYUFIP4VnFkRH0lm79fsX00oosg";

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const category of categories) {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${category}+art&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            newImages[category] = data.results[0].urls.small;
          }
        } catch (error) {
          console.error("Error fetching image for", category, error);
        }
      }
      setImages(newImages);
    };

    fetchImages();
  }, []);

  const handleCategoryClick = (category) => {
    navigate("/all-auctions", { state: { preSelectedCategory: category } });
  };

  return (
    <>
    <Navbar />
    <div className="category-page">
      <ArtBanner />
      {/* <h2 className="title">Explore Art Categories</h2> */}
      <div className="container-3">
      <div className="category-grid">
        {categories.map((category) => (
          <figure
            key={category}
            className="fancy-card"
            style={{ "--c": "#0007" }}
            onClick={() => handleCategoryClick(category)}
          >
            <img
              src={images[category] || "https://via.placeholder.com/300x200"}
              alt={category}
            />
            <figcaption>{category}</figcaption>
          </figure>
        ))}
      </div>
      </div>
    </div>
    <Footer />
    </>
  );
};
