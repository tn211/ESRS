import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // replace with the actual path to LogoutButton
import './HomePage.css';
import { HiUserCircle } from 'react-icons/hi2';
import Layout from "./Layout";
const divStyle = {

  color: 'black',



};
const HomePage = () => {
  return (
    <Layout>
      <div className="image-grid">
        <div className="image-item">
          <img src="src\assets\FOOD.jpg" alt="Image 1" />
          <p style={divStyle}>Text underneath image 1</p>
        </div>
        <div className="image-item">
          <img src="src\assets\FOOD.jpg" alt="Image 2" />
          <p style={divStyle}>Text underneath image 2</p>
        </div>
        <div className="image-item">
          <img src="src\assets\FOOD.jpg" alt="Image 3" />
          <p style={divStyle}>Text underneath image 3</p>
        </div>
        <div className="image-item">
          <img src="src\assets\FOOD.jpg" alt="Image 4" />
          <p style={divStyle}>Text underneath image 4</p>
        </div>
        <div className="image-item">
          <img src="src\assets\FOOD.jpg" alt="Image 5" />
          <p style={divStyle}>Text underneath image 5</p>
        </div>
        <div className="image-item">
          <img src="src\assets\FOOD.jpg" alt="Image 6" />
          <p style={divStyle}>Text underneath image 6</p>
        </div>
      </div>


    </Layout>
  );


};

export default HomePage;
