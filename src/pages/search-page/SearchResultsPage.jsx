import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Layout2 from "../../components/layout-components/Layout2";
import { Link } from "react-router-dom";
import "./SearchResultsPage.css";
import foodplaceholder from "../../assets/placeholder.png";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const query = useQuery().get("query");

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;

      const { data, error } = await supabase
        .from("recipes")
        .select("recipe_id, title, description, image_url")
        .ilike("title", `%${query}%`);

      if (error) {
        console.error("Error fetching recipes:", error);
        return;
      }

      setResults(data);
    };

    fetchData();
  }, [query]);

  const getFullImageUrl = (imagePath) => {
    const baseUrl =
      "https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images";
    return imagePath ? `${baseUrl}/${imagePath}` : foodplaceholder;
  };

  return (
    <Layout2>
      <div className="search-page-results">
        <h1>Search Results</h1>
        {results.length > 0
          ? results.map((recipe) => (
              <div key={recipe.recipe_id} className="search-results-card">
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <div className="search-results-img-wrapper">
                    <img
                      src={getFullImageUrl(recipe.image_url)}
                      alt={recipe.title}
                    />
                  </div>
                  <h3>{recipe.title}</h3>
                </Link>
                <p>{recipe.description}</p>
              </div>
            ))
          : query && <p>No results found for "{query}"</p>}
        <Link to={"/search"} className="ssss">
          Back to Search
        </Link>
      </div>
    </Layout2>
  );
};

export default SearchResultsPage;
