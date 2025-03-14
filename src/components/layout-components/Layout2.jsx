import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi2";
import "./Layout2.css";
import logo3 from "../../assets/DishConnectLogo3.png";
import minilogo from "../../assets/minilogo.png";

const Layout2 = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <header className={`header2 ${menuOpen ? "menu-open" : ""}`}>
        <div className="logo-container2">
          <a href="/">
            <img src={logo3} alt="Logo" className="logo2" />
            <img src={minilogo} alt="Mini logo" className="minilogo" />
          </a>
        </div>
        <nav className="nav2">
          <ul className={`menu ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/recent-recipes">Community</Link>
            </li>
            <li>
              <Link to="/my-recipes">My Recipes</Link>
            </li>
            <li>
              <Link to="/favourites">Favourites</Link>
            </li>
            <li>
              <Link to="/following">Following</Link>
            </li>
            <li>
              <Link to="/about-us">About us</Link>
            </li>
            <li>
              <Link to="/add-recipe">Upload</Link>
            </li>
          </ul>
        </nav>
        <div className="icon-container2">
          <Link to="/account">
            {" "}
            <HiUserCircle className="icon" />
          </Link>
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </header>
      <main>{children}</main> {/* Render children */}
      <footer className="footer2">
        <p>DishConnect © 2024. All rights reserved</p>
      </footer>
    </>
  );
};

export default Layout2;
