import './IngredientsCard.css'; // Importing CSS file for styling
import dummyData from "../../data/dummy-data"; // Importing dummy data

// Functional component for IngredientsCard
function IngredientsCard(){
    return(
        <>
            <div className="ingredients-card"> {/* Container for the ingredients card */}
            <h2 className='ingredients-header'>Ingredients</h2> {/* Heading for the ingredients */}
            <div className="recipe-ingredients"> {/* Container for the list of ingredients */}
                 <ul>
                    {/* Mapping over the recipeIngredients array in dummyData */}
                     {dummyData.recipeIngredients.map((ingredient, index) => (
                         <li key={index}>{ingredient[1]} {ingredient[2]} {ingredient[0]}</li> 
                     ))}
                 </ul>
             </div>
            </div>
        </>
    );
}
// Exporting IngredientsCard component
export default IngredientsCard