import React, { useEffect, useState } from "react";

const RecipesList = ({ supabase, userId }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    console.log(`Fetching recipes for userId: ${userId}`);
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("profile_id", userId);

      if (error) {
        console.error("Error fetching recipes", error);
      } else {
        console.log("Fetched recipes data:", data);
        setRecipes(data);
      }
    };

    fetchRecipes();
  }, [supabase, userId]);

  console.log("Rendering, recipes count:", recipes.length);

  return (
    <div>
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.recipe_id}>
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes found or Loading...</p> // Adjusted to reflect both cases
      )}
    </div>
  );
};

export default RecipesList;
