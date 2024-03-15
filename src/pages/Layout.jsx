import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // replace with the actual path to LogoutButton
import { HiUserCircle } from "react-icons/hi2";
import './Layout.css';

const Layout = ({ children }) => {
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
            <main>{children}</main> {/* Render children */}
            <footer>
                <p>DishConnect © 2024. All rights reserved</p>
            </footer></>
    );
};

export default Layout;