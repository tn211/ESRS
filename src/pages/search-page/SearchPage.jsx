import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { supabase, BASE_URL, recipeBucketPath } from "../../supabaseClient";
import Layout2 from "../../components/layout-components/Layout2";
import "./SearchPage.css";
import foodplaceholder from "../../assets/placeholder.png";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const query = useQuery().get("query");
  const navigate = useNavigate();

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

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      executeSearch();
    }
  };

  const executeSearch = () => {
    navigate(`/search-results?query=${searchTerm}`);
  };

  const getFullImageUrl = (imagePath) => {
    // const baseUrl =
    //   "https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images";
    return imagePath
      ? `${BASE_URL}/${recipeBucketPath}/${imagePath}`
      : foodplaceholder;
  };

  return (
    <>
      <Layout2>
        <div className="search-page">
          <div className="search-header-background">
            <h1 className="resh">Search Recipes </h1>
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            defaultValue={query}
          />
          <button onClick={executeSearch}>Search</button>
          {results.length > 0
            ? results.map((recipe) => (
                <div key={recipe.recipe_id}>
                  <Link to={`/recipes/${recipe.recipe_id}`}>
                    <div className="search-img-wrapper">
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
        </div>
      </Layout2>
    </>
  );
};

export default SearchPage;
