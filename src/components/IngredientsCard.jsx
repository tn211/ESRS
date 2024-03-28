import './IngredientsCard.css';

const recipeIngredients = [["Chicken breast", 100, "grams"], 
["Double cream", 200, "ml"],
["Gouda", 50, "grams"],
["Double cream", 200, "ml"],
["Gouda", 50, "grams"],  
["Double cream", 200, "ml"],
["Gouda", 50, "grams"],    
["Brown onions", 2, "unit"]];

function IngredientsCard(){
    return(
        <>
            <div className="ingredients-card">
            <h2 className='ingredients-header'>Ingredients</h2>
            <div className="recipe-ingredients">
                 <ul>
                     {recipeIngredients.map((ingredient, index) => (
                         <li key={index}>{ingredient[0]}: {ingredient[1]} {ingredient[2]}</li>
                     ))}
                 </ul>
             </div>
            </div>
        </>
    );
}

export default IngredientsCard