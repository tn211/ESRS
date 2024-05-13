import FOOD from '../../assets/FOOD.jpg' // Importing the image for the recipe card
import './RecipeCard.css'; // Importing CSS file for styling
import dummyData from "../../data/dummy-data"; // Importing dummy data for the recipe

// RecipeCard component
function RecipeCard(){
    return(
        <>
            <div className="recipe-card"> {/* Recipe card container */}
            <div>
                <div className='img-wrapper'>
                    <img alt="recipe picture" src={FOOD}></img> {/* Displaying recipe image */}
                </div>
                <h2 className="recipe-name">{dummyData.recipeDataObject.name}</h2> {/* Recipe name */}
            </div>
            <div className='card-bits'> {/* Displaying cooking time, prep time, and servings */}
                <p>Cooking time: {dummyData.recipeDataObject.cooktime} minutes</p>
                <p>Prep time: {dummyData.recipeDataObject.preptime} minutes</p>
                <p>Servings: {dummyData.recipeDataObject.servings}</p>
            </div>
            <div className='card-bits'> {/* Displaying rating and likes */}
                <p>Rating: {dummyData.recipeDataObject.rating}</p>
                <p>Likes: {dummyData.recipeDataObject.likes} </p>
            </div>
        </div>
        </>
    );
}

export default RecipeCard // Export RecipeCard component