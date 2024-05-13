import React from "react";
import { Link } from "react-router-dom";
import './HomePage.css';
import { HiUserCircle } from "react-icons/hi2";
import Layout from '../../components/layout-components/Layout';
import RecipeCard from "../../components/recipe-card/RecipeCard";
import Dropdown from '../../components/dropdown/Dropdown';
import Layout2 from "../../components/layout-components/Layout2";



const HomePage = () => {
  return (
    <Layout2>
    
      < div className="welcome-message">
        Welcome Eaters!
        Find the perfect recipe for you

      </div>

    </Layout2>
  );



};

export default HomePage;

/* <div className="card-grid">
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
     <Link to="/recipe-image-upload">Image Upload</Link>*/
