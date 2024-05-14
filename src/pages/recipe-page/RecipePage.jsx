import React from "react";
// import { Link } from "react-router-dom";
import "./RecipePage.css";
import RecipeCard from "../../components/recipe-card/RecipeCard";
import IngredientsCard from "../../components/ingredients-card/IngredientsCard";
import dummyData from "../../data/dummy-data";
import MethodCard from "../../components/method-card/MethodCard";
import TipsCard from "../../components/tips-card/TipsCard";
import Layout from "../../components/layout-components/Layout";

function RecipePage() {
  return (
    <>
      <Layout>
        <h1>TESTING RECIPE PAGE</h1>
        <RecipeCard />

        <div>
          <IngredientsCard />
        </div>

        <div>
          <MethodCard />
        </div>

        <div>
          <TipsCard />
        </div>

        <div className="recipe-spiel">
          <h3>Story Behind the Recipe</h3>
          {dummyData.recipeSpiel.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Layout>
    </>
  );
}

export default RecipePage;
