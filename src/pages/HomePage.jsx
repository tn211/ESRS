import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // replace with the actual path to LogoutButton
import './HomePage.css';
import { HiUserCircle } from "react-icons/hi2";
const divStyle = {

  color: 'black',



};
const HomePage = () => {
  return (
    <><header>
      <div className="icon-container">
        <Link to="/account"> <HiUserCircle className="icon" /></Link>
      </div>
      <nav>
        <ul className="menu">
          <li>
            <Link to="/add-recipe">Add Recipe</Link>
          </li>
          <li>
            <Link to="/add-ingredients">Add Ingredients</Link>
          </li>
          <li>
            <Link to="/my-recipes">My Recipes</Link>
          </li>
          <li>
            <Link to="/my-recipes">Page 4</Link>
          </li>

        </ul>
      </nav>
      <div className="logo-container">
        <a href="/">
          <img src="src\assets\Dishconnect.PNG" alt="Logo" className="logo" />
        </a>
      </div>
    </header>
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
      <footer>
        <p>DishConnect © 2024. All rights reserved</p>
      </footer></>

  );


};

export default HomePage;
