import React from "react";
import { Link } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import Layout from "./Layout";


const UserRecipesPage = ({ supabase }) => {
  const userId = 1; // Hardcoded for testing, replace with dynamic user ID as needed

  return (
    <Layout>
      <div>
        <h1>My Recipes</h1>
        <RecipeList supabase={supabase} userId={userId} />
        <Link to="/">Back to Home</Link>
      </div>
    </Layout>
  );
};

export default UserRecipesPage;
