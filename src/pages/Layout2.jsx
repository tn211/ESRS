import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi2";
import './Layout2.css';

const Layout2 = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (

        <><header className={`header2 ${menuOpen ? "menu-open" : ""}`}>
            <div className="logo-container2">
                <a href="/">
                    <img src="src\assets\Dishconnect3.PNG" alt="Logo" className="logo2" />
                </a>
            </div>
            <nav className="nav2">
                <ul className={`menu ${menuOpen ? "open" : ""}`}>
                    <li>
                        <Link to="/add-recipe">Recipes</Link>
                    </li>
                    <li>
                        <Link to="/my-recipes">Favourites</Link>
                    </li>
                    <li>
                        <Link to="/recent-recipes">Community</Link>
                    </li>
                    <li>
                        <Link to="/AboutUs">About us</Link>
                    </li>
                    <li>
                        <Link to="/">Upload</Link>
                    </li>

                </ul>
            </nav>
            <div className="icon-container2">
                <Link to="/account"> <HiUserCircle className="icon" /></Link>
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
            </footer></>
    );
};

export default Layout2;