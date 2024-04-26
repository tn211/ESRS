import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  };

  const executeSearch = () => {
    navigate(`?query=${searchTerm}`);
  };

  return (
    <>
      <Layout>
        <div>
          <h1>Search Recipes</h1>
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

export default SearchPage;