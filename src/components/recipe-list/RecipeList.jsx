import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RecipeList.css";
import foodplaceholder from "../../assets/placeholder.png";

const RecipesList = ({ supabase, userId }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    console.log(`Fetching recipes for userId: ${userId}`);
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("title, recipe_id, image_url")
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

  const getFullImageUrl = (imagePath) => {
    const baseUrl =
      "https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images";
    return `${baseUrl}/${imagePath}`;
  };

  console.log("Rendering, recipes count:", recipes.length);

  return (
    <div className="recipe-list">
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.recipe_id}>
              <Link to={`/recipes/${recipe.recipe_id}`}>
                <div className="img-wrapper">
                  <img
                    src={
                      recipe.image_url
                        ? getFullImageUrl(recipe.image_url)
                        : foodplaceholder
                    }
                    alt={recipe.title}
                  />
                </div>
                <h3>{recipe.title}</h3>
              </Link>
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
