import React, { useState, useEffect } from "react";
import './HomePage.css';
import Layout2 from "../../components/layout-components/Layout2";


const HomePage = () => {
  return (
    <Layout2>
      <div className="welcome-message">
        Welcome Eaters!
        
      </div>
      <Carousel />
    </Layout2>
  );
};

export default HomePage;
