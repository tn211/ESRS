import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure you import Link from react-router-dom
import { supabase } from '../supabaseClient';
import Layout from './Layout';

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
        .from('likes')
        .select('recipe_id')
        .eq('profile_id', profileId);

      if (likesError) {
        console.error('Error fetching favourite recipes:', likesError);
        setLoading(false);
        return;
      }

      if (likesData.length === 0) {
        setLoading(false);
        return;
      }

      const recipeIds = likesData.map(like => like.recipe_id);

      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('recipe_id', recipeIds);

      if (recipesError) {
        console.error('Error fetching recipes based on likes:', recipesError);
        setLoading(false);
        return;
      }

      setFavouriteRecipes(recipesData);
      setLoading(false);
    };

    fetchFavouriteRecipes();
  }, [session]);

  return (
    <Layout>
      <div>
        <h1>My Favourites</h1>
        {loading ? (
          <p>Loading your favourite recipes...</p>
        ) : (
          favouriteRecipes.length > 0 ? (
            <ul>
              {favouriteRecipes.map((recipe) => (
                <li key={recipe.recipe_id}>
                  <Link to={`/recipes/${recipe.recipe_id}`}>{recipe.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no favourite recipes.</p>
          )
        )}
      </div>
    </Layout>
  );
};

export default UserFavouritesPage;




// import React, { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import RecipeList from '../components/RecipeList';
// import Layout from './Layout';

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

//       console.log("Session is available, proceeding to fetch favourite recipes");

//       // Step 1: Fetch the IDs of favourite recipes for the user
//       const profileId = session.user.id;
//       console.log(`Profile ID: ${profileId}`);
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
//         console.log("No favourite recipes found for the user.");
//         setLoading(false);
//         return;
//       }

//       const recipeIds = likesData.map(like => like.recipe_id);

//       // Step 2: Fetch the full details for each favourite recipe including ingredients
//       const { data: recipesData, error: recipesError } = await supabase
//         .from('recipes')
//         .select(`
//           *,
//           ingredients (
//             ingredient_id,
//             name,
//             quantity,
//             recipe_id
//           )
//         `)
//         .in('recipe_id', recipeIds); // Use the 'in' filter to fetch all recipes with the IDs we found

//       if (recipesError) {
//         console.error('Error fetching recipes based on likes:', recipesError);
//         setLoading(false);
//         return;
//       }

//       console.log("Fetched favourite recipes based on likes:", recipesData);

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
//             <RecipeList recipes={favouriteRecipes} />
//           ) : (
//             <p>You have no favourite recipes.</p>
//           )
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default UserFavouritesPage;


