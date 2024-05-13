import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Layout2 from "../../components/layout-components/Layout2";
import "./UserFavourites.css";
import foodplaceholder from "../../assets/placeholder.png";

const UserFavouritesPage = ({ session }) => {
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      if (!session || !session.user) {
        console.log("Session or session.user is not available");
        setLoading(false);
        return;
      }

      const profileId = session.user.id;
      const { data: likesData, error: likesError } = await supabase
        .from("likes")
        .select("recipe_id")
        .eq("profile_id", profileId);

      if (likesError) {
        console.error("Error fetching favourite recipes:", likesError);
        setLoading(false);
        return;
      }

      if (likesData.length === 0) {
        setLoading(false);
        return;
      }

      const recipeIds = likesData.map((like) => like.recipe_id);

      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select("recipe_id, title, image_url") // Select image_url along with other fields
        .in("recipe_id", recipeIds);

      if (recipesError) {
        console.error("Error fetching recipes based on likes:", recipesError);
        setLoading(false);
        return;
      }

      setFavouriteRecipes(recipesData);
      setLoading(false);
    };

    fetchFavouriteRecipes();
  }, [session]);

  const getFullImageUrl = (imagePath) => {
    const baseUrl =
      "https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images";
    return imagePath ? `${baseUrl}/${imagePath}` : foodplaceholder;
  };

  return (
    <Layout2>
      <div className="favourites-page">
        <h1>My Favourites</h1>
        {loading ? (
          <p>Loading your favourite recipes...</p>
        ) : favouriteRecipes.length > 0 ? (
          <ul>
            {favouriteRecipes.map((recipe) => (
              <li key={recipe.recipe_id}>
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <div className="img-wrapper">
                    <img
                      src={getFullImageUrl(recipe.image_url)}
                      alt={recipe.title}
                    />
                  </div>
                  {recipe.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no favourite recipes.</p>
        )}
      </div>
    </Layout2>
  );
};

export default UserFavouritesPage;

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { supabase } from '../../supabaseClient';
// import Layout from '../../components/layout-components/Layout';

// const UserFavouritesPage = ({ session }) => {
//   const [favouriteRecipes, setFavouriteRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFavouriteRecipes = async () => {
//       if (!session || !session.user) {
//         console.log("Session or session.user is not available");
//         setLoading(false);
//         return;
//       }

//       const profileId = session.user.id;
//       const { data: likesData, error: likesError } = await supabase
//         .from('likes')
//         .select('recipe_id')
//         .eq('profile_id', profileId);

//       if (likesError) {
//         console.error('Error fetching favourite recipes:', likesError);
//         setLoading(false);
//         return;
//       }

//       if (likesData.length === 0) {
//         setLoading(false);
//         return;
//       }

//       const recipeIds = likesData.map(like => like.recipe_id);

//       const { data: recipesData, error: recipesError } = await supabase
//         .from('recipes')
//         .select('*')
//         .in('recipe_id', recipeIds);

//       if (recipesError) {
//         console.error('Error fetching recipes based on likes:', recipesError);
//         setLoading(false);
//         return;
//       }

//       setFavouriteRecipes(recipesData);
//       setLoading(false);
//     };

//     fetchFavouriteRecipes();
//   }, [session]);

//   return (
//     <Layout>
//       <div>
//         <h1>My Favourites</h1>
//         {loading ? (
//           <p>Loading your favourite recipes...</p>
//         ) : (
//           favouriteRecipes.length > 0 ? (
//             <ul>
//               {favouriteRecipes.map((recipe) => (
//                 <li key={recipe.recipe_id}>
//                   <Link to={`/recipes/${recipe.recipe_id}`}>{recipe.title}</Link>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>You have no favourite recipes.</p>
//           )
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default UserFavouritesPage;
