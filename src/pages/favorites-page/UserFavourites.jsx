// Importing necessary modules and components
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { supabase } from '../../supabaseClient';
import Layout from '../../components/layout-components/Layout';
import './UserFavourites.css'

// Component to display user's favourite recipes
const UserFavouritesPage = ({ session }) => {
  // State to hold the list of favourite recipes
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);

   // Effect to fetch favourite recipes after component mounts or session changes
  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      // Check for valid session and user object
      if (!session || !session.user) {
        console.log("Session or session.user is not available");
        setLoading(false);
        return;
      }
      // Retrieve user's profile ID from the session
      const profileId = session.user.id;
      // Fetch 'likes' data associated with the user
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('recipe_id')
        .eq('profile_id', profileId);

      // Error handling for likes fetch
      if (likesError) {
        console.error('Error fetching favourite recipes:', likesError);
        setLoading(false);
        return;
      }

      // Return early if no liked recipes are found
      if (likesData.length === 0) {
        setLoading(false);
        return;
      }
      // Map over likesData to get an array of recipe IDs
      const recipeIds = likesData.map(like => like.recipe_id);
      // Fetch actual recipe details based on liked recipe IDs
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('recipe_id, title, image_url')  // Select image_url along with other fields
        .in('recipe_id', recipeIds);
      // Error handling for recipes fetch
      if (recipesError) {
        console.error('Error fetching recipes based on likes:', recipesError);
        setLoading(false);
        return;
      }
      // Update state with the fetched recipes
      setFavouriteRecipes(recipesData);
      setLoading(false);
    };
    // Execute the fetch function
    fetchFavouriteRecipes();
  }, [session]); // Effect depends on changes in session
  // Function to construct the full image URL
  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images';
    return imagePath ? `${baseUrl}/${imagePath}` : "/src/assets/placeholder.png";
  };
  // Rendering the component using JSX
  return (
    <Layout>
      <div className='favourites-page'>
        <h1>My Favourites</h1>
        {loading ? (
          <p>Loading your favourite recipes...</p>
        ) : (
          favouriteRecipes.length > 0 ? (
            <ul>
              {favouriteRecipes.map((recipe) => (
                <li key={recipe.recipe_id}>
                  <Link to={`/recipes/${recipe.recipe_id}`}>
                    <div className='img-wrapper'>
                    <img src={getFullImageUrl(recipe.image_url)} alt={recipe.title}/>
                    </div>
                    {recipe.title}
                  </Link>
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
// Exports the component for use in other parts of the application
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
