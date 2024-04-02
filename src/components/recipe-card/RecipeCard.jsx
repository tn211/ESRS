import FOOD from '../../assets/FOOD.jpg'
import './RecipeCard.css';
import dummyData from "../../data/dummy-data";


function RecipeCard(){
    return(
        <>
            <div className="recipe-card">
            <div>
                <div className='img-wrapper'>
                    <img alt="recipe picture" src={FOOD}></img>
                </div>
                <h2 class="recipe-name">{dummyData.recipeDataObject.name}</h2>
            </div>
            <div className='card-bits'>
                <p>Cooking time: {dummyData.recipeDataObject.cooktime} minutes</p>
                <p>Prep time: {dummyData.recipeDataObject.preptime} minutes</p>
                <p>Servings: {dummyData.recipeDataObject.servings}</p>
            </div>
            <div className='card-bits'>
                <p>Rating: {dummyData.recipeDataObject.rating}</p>
                <p>Likes: {dummyData.recipeDataObject.likes} </p>
            </div>
        </div>
        </>
    );
}

export default RecipeCard