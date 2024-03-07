
function RecipePage() {
    /*dummy values provided in variables for rendering sample page */
    /* recipeData to include: prep time, cook time, rating, likes/saves */
    const recipeData = [20, 20, 4.5, 200]

    const recipeIngredients = [["Chicken breast", 100, "grams"], 
                                ["Brown onions", 2, "unit"]];

    const recipeMethod = ["Chop onions and fry in pan for 5 minutes",
                        "While onions cook, chop chicken, then add to pan",
                        "etc"];

    const recipeTips = ["try adding chocoloate for an unusual twist",
                        "etc"];

    const recipeSpiel = ["This recipe always reminds me of my mum, who cooks it a lot, etc"]


    return (
        <>
            <Link to="/">Back to Home</Link>
            <div className="recipe-data">
                <h2>Recipe Details</h2>
                <p>Prep Time: {recipeData[0]} minutes</p>
                <p>Cook Time: {recipeData[1]} minutes</p>
                <p>Rating: {recipeData[2]} stars</p>
                <p>Likes/Saves: {recipeData[3]}</p>
            </div>
            <div className="recipe-ingredients">
                <h3>Ingredients</h3>
                <ul>
                    {recipeIngredients.map((ingredient, index) => (
                        <li key={index}>{ingredient[0]}: {ingredient[1]} {ingredient[2]}</li>
                    ))}
                </ul>
            </div>
            <div className="recipe-method">
                <h3>Method</h3>
                <ol>
                    {recipeMethod.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
            <div className="recipe-tips">
                <h3>Tips</h3>
                <ul>
                    {recipeTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
            <div className="recipe-spiel">
                <h3>Story Behind the Recipe</h3>
                {recipeSpiel.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </>
    );
}

export default RecipePage;