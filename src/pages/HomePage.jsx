import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // replace with the actual path to LogoutButton
import './HomePage.css';

const HomePage = () => {
  return (
    <><header>
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
            <Link to="/avatar">Avatar</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
        </ul>
      </nav>
      <div className="logo-container">
        <a href="/">
          <img src="src\assets\Dishconnect.PNG" alt="Logo" className="logo" />
        </a>
      </div>
    </header>
      <footer>
        <p>FOOTER</p>
      </footer></>
  );

};

export default HomePage;
