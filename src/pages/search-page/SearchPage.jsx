import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Importing necessary hooks and components
import { supabase } from '../../supabaseClient'; // Importing supabase client
import Layout from '../../components/layout-components/Layout'; // Importing layout component
import './SearchPage.css' // Importing CSS for SearchPage styling

// Custom hook to get query parameters from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const [results, setResults] = useState([]); // State to hold search results
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search term
  const query = useQuery().get('query'); // Getting 'query' parameter from URL
  const navigate = useNavigate(); // Hook for navigation
// Effect to fetch data when query changes
  useEffect(() => {
    const fetchData = async () => {
      if (!query) return; // If no query, return
      const { data, error } = await supabase // Fetching data from Supabase
        .from('recipes')
        .select('recipe_id, title, description, image_url')
        .ilike('title', `%${query}%`);

      if (error) {
        console.error('Error fetching recipes:', error); // Logging error if any
        return;
      }

      setResults(data); // Setting fetched data to results state
    };

    fetchData(); // Calling fetchData function
  }, [query]); // Dependency array with query
// Handler for input change
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Updating searchTerm state with input value
  };
// Handler for key press event
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      executeSearch(); // If Enter key pressed, execute search
    }
  };
// Function to execute search
  const executeSearch = () => {
    navigate(`?query=${searchTerm}`); // Navigate to URL with new search query
  };
// Function to get full image URL
  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images';
    return imagePath ? `${baseUrl}/${imagePath}` : "/src/assets/placeholder.png";
  };

  return (
    <>
      <Layout>
        <div className='search-page'>
          <h1>Search Recipes TEST</h1>
          <input
            type="text"
            placeholder="Search recipes..."
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            defaultValue={query}
          />
          <button onClick={executeSearch}>Search</button>
          {results.length > 0 ? (
            results.map((recipe) => (
              <div key={recipe.recipe_id}>
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <div className='search-img-wrapper'>
                    <img src={getFullImageUrl(recipe.image_url)} alt={recipe.title}/> {/* Rendering recipe image */}
                  </div>
                  <h3>{recipe.title}</h3>
                </Link>
                <p>{recipe.description}</p>
              </div>
            ))
          ) : (
            query && <p>No results found for "{query}"</p>
          )}
        </div>
      </Layout>
    </>
  );
};
// Exporting SearchPage component
export default SearchPage;


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { supabase } from '../../supabaseClient';
// import Layout from '../../components/layout-components/Layout';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// const SearchPage = () => {
//   const [results, setResults] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const query = useQuery().get('query');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!query) return;
//       const { data, error } = await supabase
//         .from('recipes')
//         .select('*')
//         .ilike('title', `%${query}%`);

//       if (error) {
//         console.error('Error fetching recipes:', error);
//         return;
//       }

//       setResults(data);
//     };

//     fetchData();
//   }, [query]);

//   const handleInputChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       executeSearch();
//     }
//   };

//   const executeSearch = () => {
//     navigate(`?query=${searchTerm}`);
//   };

//   return (
//     <>
//       <Layout>
//         <div>
//           <h1>Search Recipes</h1>
//           <input
//             type="text"
//             placeholder="Search recipes..."
//             onChange={handleInputChange}
//             onKeyPress={handleKeyPress}
//             defaultValue={query}
//           />
//           <button onClick={executeSearch}>Search</button>
//           {results.length > 0 ? (
//             results.map((recipe) => (
//               <div key={recipe.recipe_id}>
//                 <Link to={`/recipes/${recipe.recipe_id}`}>
//                   <h3>{recipe.title}</h3>
//                 </Link>
//                 <p>{recipe.description}</p>
//               </div>
//             ))
//           ) : (
//             query && <p>No results found for "{query}"</p>
//           )}
//         </div>
//       </Layout>
//     </>
//   );
// };

// export default SearchPage;