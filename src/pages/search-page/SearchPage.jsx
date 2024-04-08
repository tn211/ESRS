import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Import Link here
import { supabase } from '../../supabaseClient';
import Layout from '../Layout';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const query = useQuery().get('query');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .ilike('title', `%${query}%`);

      if (error) {
        console.error('Error fetching recipes:', error);
        return;
      }

      setResults(data);
    };

    fetchData();
  }, [query]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const executeSearch = () => {
    navigate(`?query=${searchTerm}`);
  };

  return (
    <>
    <Layout>
    <div>
      <input
        type="text"
        placeholder="Search recipes..."
        onChange={handleInputChange}
        defaultValue={query}
      />
      <button onClick={executeSearch}>Search</button>
      {results.length > 0 ? (
        results.map((recipe) => (
          <div key={recipe.recipe_id}>
            <Link to={`/recipes/${recipe.recipe_id}`}>
              <h3>{recipe.title}</h3>
            </Link>
            <p>{recipe.description}</p>
          </div>
        ))
      ) : (
        query && <p>No results found for "{query}"</p> // Only show this message if `query` is not empty
      )}
    </div>
    </Layout>
    </>
  );
  
};

export default SearchPage;





// import React, { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
//   }
  
//   const SearchPage = () => {
//     const [results, setResults] = useState([]);
//     const query = useQuery().get('query');
  
//     useEffect(() => {
//       const fetchData = async () => {
//         if (!query) return;
//         const { data, error } = await supabase
//           .from('recipes')
//           .select('*')
//           .ilike('title', `%${query}%`);
  
//         if (error) {
//           console.error('Error fetching recipes:', error);
//           return;
//         }
  
//         setResults(data);
//       };
  
//       fetchData();
//     }, [query]); // Removed 'supabase' from the dependency array as it's imported
  
//     return (
//       <div>
//         {results.length > 0 ? (
//           results.map((recipe) => (
//             <div key={recipe.id}>
//               <h3>{recipe.title}</h3>
//               {/* Render more recipe details here as needed */}
//             </div>
//           ))
//         ) : (
//           <p>No results found for "{query}"</p>
//         )}
//       </div>
//     );
//   };

//   export default SearchPage;

// import React, { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient';

// const SearchBar = ({ onSearch }) => {
//     const [query, setQuery] = useState('');
  
//     const handleSearch = async (e) => {
//       e.preventDefault();
//       if (!query) return;
  
//       try {
//         const { data, error } = await supabase
//           .from('recipes')
//           .select('*')
//           .ilike('title', `%${query}%`);
  
//         if (error) throw error;
//         onSearch(data); // Pass the search result to the parent component or handle it here
//       } catch (error) {
//         alert(error.message);
//       }
//     };
  
//     return (
//       <form onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search recipes..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button type="submit">Search</button>
//       </form>
//     );
//   };
  
//   export default SearchBar;


// import React from 'react';

// const SearchPage = () => {
//     return (
//         <div>
//             <h1>Search Page</h1>
//             <p>This is the search page.</p>
//         </div>
//     );
// }

// export default SearchPage;
