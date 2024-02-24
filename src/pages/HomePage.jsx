import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>DishConnect</h1>
      <Link to="/add-recipe">Submit New Recipe</Link>
        <br />
      <Link to="/my-recipes">View My Recipes</Link>
      {/* You can add more content and styling as needed */}
    </div>
  );
};

export default HomePage;
