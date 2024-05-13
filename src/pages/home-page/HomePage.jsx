import React, { useState, useEffect } from "react";
import './HomePage.css';
import Layout2 from "../../components/layout-components/Layout2";

const images = [
    "url-to-image1.jpg",  // Asegúrate de cambiar estas URL por las reales de tus imágenes
    "url-to-image2.jpg",
    "url-to-image3.jpg"
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((currentIndex + 1) % images.length);
        }, 3000); // Cambia imagen cada 3 segundos

        return () => clearInterval(intervalId);
    }, [currentIndex]);

    return (
        <div className="carousel">
            {images.map((image, index) => (
                <div
                    key={index}
                    className="carousel-item"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    <img src={image} alt={`Slide ${index}`} />
                </div>
            ))}
        </div>
    );
};

const HomePage = () => {
  return (
    <Layout2>
      <div className="welcome-message">
        Welcome Eaters!
        Find the perfect recipe for you
      </div>
      <Carousel />
    </Layout2>
  );
};

export default HomePage;
