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
            <Link to="/add-recipe">Page 1</Link>
          </li>
          <li>
            <Link to="/add-ingredients">Page 2</Link>
          </li>
          <li>
            <Link to="/my-recipes">Page 3</Link>
          </li>
          <li>
            <Link to="/my-recipes">Page 4</Link>
          </li>
          <li>
            <Link to="/my-recipes">Page 5</Link>
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
