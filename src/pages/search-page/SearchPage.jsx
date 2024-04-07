// import React, { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';

// const SearchBar = ({ onSearch }) => {
//     const [query, setQuery] = useState('');
  
//     const handleSearch = async (e) => {
//       e.preventDefault();
//       if (!query) return;
  
//       try {
//         const { data, error } = await supabase
//           .from('recipes')
//           .select('*')
//           .ilike('name', `%${query}%`);
  
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


import React from 'react';

const SearchPage = () => {
    return (
        <div>
            <h1>Search Page</h1>
            <p>This is the search page.</p>
        </div>
    );
}

export default SearchPage;
