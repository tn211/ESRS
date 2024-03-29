import './IngredientsCard.css';
import dummyData from "../../data/dummy-data";


function IngredientsCard(){
    return(
        <>
            <div className="ingredients-card">
            <h2 className='ingredients-header'>Ingredients</h2>
            <div className="recipe-ingredients">
                 <ul>
                     {dummyData.recipeIngredients.map((ingredient, index) => (
                         <li key={index}>{ingredient[1]} {ingredient[2]} {ingredient[0]}</li>
                     ))}
                 </ul>
             </div>
            </div>
        </>
    );
}

export default IngredientsCard