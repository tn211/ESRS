import React, { useEffect, useState } from "react";

const RecipesList = ({ supabase, userId }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching recipes", error);
      } else {
        setRecipes(data);
      }
    };

    fetchRecipes();
  }, [supabase, userId]);

  return (
    <div>
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.recipe_id}>
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes found</p>
      )}
    </div>
  );
};

export default RecipesList;
