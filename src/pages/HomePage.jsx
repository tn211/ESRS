import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // replace with the actual path to LogoutButton
import './HomePage.css';


const HomePage = () => {
  return (
    <header>
      <div className="logo">
        <img src="src\assets\Capture.PNG" alt="Logo" />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/add-recipe">Submit New Recipe</Link>
          </li>
          <li>
            <Link to="/add-ingredients">Submit Recipe Ingredients</Link>
          </li>
          <li>
            <Link to="/my-recipes">View My Recipes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HomePage;


/*const HomePage = () => {
  return (
    <div>
      <h1>DishConnect</h1>
      <Link to="/add-recipe">Submit New Recipe</Link>
      <br />
      <Link to="/add-ingredients">Submit Recipe Ingredients</Link>
      <br />
      <Link to="/my-recipes">View My Recipes</Link>
      <br />
      <LogoutButton />
    </div>
  );
};

export default HomePage;*/