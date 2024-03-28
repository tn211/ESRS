// import chicken1 from '../assets/chicken1.jpg'
// <img src="src\assets\FOOD.jpg" alt="Image 1" />
import FOOD from '../assets/FOOD.jpg'
import './RecipeCard.css';

const recipeData = ["Spicy Tomato Pasta", 20, 15, 4.6, 188]

function RecipeCard(){
    return(
        <>
            <div className="recipe-card">
            <div>
                <div className='img-wrapper'>
                    <img alt="recipe picture" src={FOOD}></img>
                </div>
                <h2 class="recipe-name">{recipeData[0]}</h2>
            </div>
            <div className='card-bits'>
                <p>Cooking time: {recipeData[1]} minutes</p>
                <p>Prep time: {recipeData[2]} minutes</p>
            </div>
            <div className='card-bits'>
                <p>Rating: {recipeData[3]}</p>
                <p>Likes: {recipeData[4]} </p>
            </div>
        </div>
        </>
    );
}

export default RecipeCard



{/* <div className="recipe-card">
            <div>
                <div className='img-wrapper'>
                    <img alt="recipe picture" src={chicken1}></img>
                </div>
                <h2>{recipeData[0]}</h2>
            </div>
            <div className='card-bits'>
                <p>Cooking time: {recipeData[1]} minutes</p>
                <p>Prep time: {recipeData[2]} minutes</p>
            </div>
            <div className='card-bits'>
                <p>Rating: {recipeData[3]}</p>
                <p>Likes: {recipeData[4]} </p>
            </div>
        </div> */}