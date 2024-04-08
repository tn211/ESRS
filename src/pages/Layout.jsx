import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi2";
import './Layout.css';

const Layout = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (

        <><header className={`header ${menuOpen ? "menu-open" : ""}`}>
            <div className="logo-container">
                <a href="/">
                    <img src="/src/assets/Dishconnect2.PNG" alt="Logo" className="logo" />
                </a>
            </div>
            <nav>
                <ul className={`menu ${menuOpen ? "open" : ""}`}>
                    <li>
                        <Link to="/recent-recipes">Recipes</Link>
                    </li>
                    <li>
                        <Link to="/my-recipes">Favourites</Link>
                    </li>
                    <li>
                        <Link to="/recent-recipes">Community</Link>
                    </li>
                    <li>
                        <Link to="/">About us</Link>
                    </li>
                    <li>
                        <Link to="/search">Search</Link>
                    </li>
                    <li>
                        <Link to="/add-recipe">Upload</Link>
                    </li>
                    <li><Link to="/about-us">About Us</Link>
                    </li>

                </ul>
            </nav>
            <div className="icon-container">
                <Link to="/account"> <HiUserCircle className="icon" /></Link>
            </div>
            <div className="menu-toggle" onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </header>
            <main>{children}</main> {/* Render children */}
            <footer>
                <p>DishConnect © 2024. All rights reserved</p>
            </footer></>
    );
};

export default Layout;