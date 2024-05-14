import React, { useEffect, useState } from "react";
import { supabase, BASE_URL, recipeBucketPath } from "../../supabaseClient";
import Layout2 from "../../components/layout-components/Layout2";
import { Link } from "react-router-dom";
import "./RecentRecipesPage.css";
import foodplaceholder from "../../assets/placeholder.png";


const RecentRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered in RecentRecipesPage");

    const fetchRecentRecipes = async () => {
      console.log("Fetching 10 most recent recipes");

      const { data, error } = await supabase
        .from("recipes")
        .select(
          `
          *,
          image_url,
          ingredients (
            ingredient_id,
            name,
            quantity,
            recipe_id
          )
        `,
        )
        .order("created_at", { ascending: false }) // Order by created_at in descending order
        .limit(10); // Limit to 10 results

      if (error) {
        console.error("Error fetching recent recipes:", error);
        setLoading(false);
        return;
      }

      console.log("10 most recent recipes fetched successfully:", data);
      setRecipes(data);
      setLoading(false);
    };

    fetchRecentRecipes();
  }, []); // Empty dependency array means this effect runs once on mount

  // function to construct full image URL
  const getFullImageUrl = (imagePath) => {
    //const baseUrl =
    // "https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images";
    // return `${baseUrl}/${imagePath}`;
    // const imgBucket = "/storage/v1/object/public/recipe-images"
    return `${BASE_URL}/${recipeBucketPath}/${imagePath}`;
  };

  console.log(
    `Rendering RecentRecipesPage, Recipes Count: ${recipes.length}, Loading: ${loading}`,
  );

  return (
    <Layout2>
      <div className="recent-recipe-page">
        <h1>Community</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {recipes.map((recipe, index) => (
              <div key={`${recipe.recipe_id}-${index}`} className="cardrrp">
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <div className="img-wrapperrrp">
                    <img
                      src={
                        recipe.image_url
                          ? getFullImageUrl(recipe.image_url)
                          : foodplaceholder
                      }
                      alt={recipe.title}
                    />
                  </div>
                  <h2>{recipe.title}</h2>
                  <p>{recipe.description}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
        {/* Link back to home */}
        <div style={{ marginTop: "20px" }}>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </Layout2>
  );
};

export default RecentRecipesPage;
