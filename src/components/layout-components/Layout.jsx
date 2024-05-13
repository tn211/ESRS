import React from "react"; // Importing React library
import { useState } from "react"; // Importing useState hook from React
import { Link } from "react-router-dom"; // Importing Link component from React Router
import { HiUserCircle } from "react-icons/hi2"; // Importing HiUserCircle icon from react-icons
import './Layout.css'; // Importing CSS file for styling
// Functional component for Layout
const Layout = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false); // State for controlling menu open/close
// Function to toggle menu open/close state
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        
        <><header className={`header1 ${menuOpen ? "menu-open" : ""}`}> {/* Header section */}
            <div className="logo-container">
                <a href="/">
                    <img src="/src/assets/Dishconnect2.PNG" alt="Logo" className="logo" />
                </a>
            </div>
            <nav className="nav1"> {/* Navigation menu */}
                <ul className={`menu ${menuOpen ? "open" : ""}`}> {/* Menu items */}
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
            <div className="icon-container"> {/* User icon */}
                <Link to="/account"> <HiUserCircle className="icon" /></Link>
            </div>
            <div className="menu-toggle" onClick={toggleMenu}> {/* Menu toggle button */}
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </header>
            <main>{children}</main> {/* Render children */}
            <footer className="footer1"> {/* Footer */}
                <p>DishConnect © 2024. All rights reserved</p>
            </footer></>
    );
};
// Exporting Layout component
export default Layout;