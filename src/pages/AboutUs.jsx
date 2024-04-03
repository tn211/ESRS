import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <header className="header">
        {/* You can reuse the header component if you have one */}
      </header>
      
      <main className="main-content">
        <h1>About Us</h1>
        <p>
          Welcome to DishConnect! We are a passionate team of food enthusiasts 
          dedicated to connecting home cooks with the world of culinary arts. 
          Our platform is a place to discover, share, and grow your love for cooking.
        </p>
        <p>
          At DishConnect, we believe in the power of community and the joy that 
          comes from the simple act of creating and enjoying food. Whether you're 
          here to find your next favorite recipe or to share your own culinary creations, 
          we're glad you're part of our journey.
        </p>
        
        {/* Add more content about your mission, your team, and the story of your company */}
      </main>
      
      <footer className="footer">
        {/* You can reuse the footer component if you have one */}
      </footer>
    </div>
  );
};

export default AboutUs;
