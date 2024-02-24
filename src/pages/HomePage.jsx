import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Our Recipe App</h1>
      <Link to="/add-recipe">Add a New Recipe</Link>
      {/* You can add more content and styling as needed */}
    </div>
  );
};

export default HomePage;
