import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate for navigation
import { supabase } from '../../supabaseClient';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Local state to store the search term
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

  // Function to handle search input changes
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Update searchTerm with input
  };

  // Function to execute search
  const executeSearch = () => {
    // Update the URL, which will trigger re-fetching of data based on the new query
    navigate(`?query=${searchTerm}`);
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search recipes..."
        onChange={handleInputChange}
        defaultValue={query}
      />
      {/* Search Button */}
      <button onClick={executeSearch}>Search</button>
      {results.length > 0 ? (
        results.map((recipe) => (
          <div key={recipe.id}>
            <h3>{recipe.title}</h3>
            {/* Render more recipe details here as needed */}
          </div>
        ))
      ) : (
        <p>No results found for "{query}"</p>
      )}
    </div>
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
