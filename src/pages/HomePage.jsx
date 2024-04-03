import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton"; // replace with the actual path to LogoutButton
import './HomePage.css';
import { HiUserCircle } from "react-icons/hi2";
import Layout from "./Layout";
import RecipeCard from "../components/recipe-card/RecipeCard";


const divStyle = {

  color: 'black',



};
const HomePage = () => {
  return (
    <Layout>
      <div className="card-grid">
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      <Link to="/recipe"><RecipeCard className="recipe-card"/></Link>
      </div>


    </Layout>
  );



};

export default HomePage;