import React from 'react';

const RecipeList = ({ recipes }) => {
  return (
    <div className="recipesList">
      {recipes.map((recipe, index) => (
        <div key={index} className="recipeItem">
          <strong>{recipe.title}</strong>: {recipe.description}
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
