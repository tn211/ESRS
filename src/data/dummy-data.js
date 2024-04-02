
   /*dummy values for rendering sample pages */


    /* recipeData to include: prep time, cook time, rating, likes/saves */
    const recipeData = [20, 20, 4.5, 200]


    const recipeDataObject = {
        name: "Spicy Tomato Pasta",
        preptime: 20, 
        cooktime: 15,
        servings: 4, 
        rating: 4.6,
        likes: 188
    };

    const recipeIngredients = [["Chicken breast", 100, "grams"], 
                                ["Double cream", 200, "ml"],
                                ["Gouda", 50, "grams"],
                                ["Scotch Bonnett Chillis", 2, "unit"], 
                                ["Baked Beans", 200, "grams"],
                                ["Banana", 50, "grams"],   
                                ["Brown onions", 2, "unit"]];

    const recipeMethod = ["Chop onions and fry in pan for 5 minutes",
                        "While onions cook, chop chicken, then add to pan",
                        "Cook until black and smoky",
                        "Chop bananas and fry in pan for 5 minutes",
                        "While bananas cook, chop chillis, then add to pan",
                        "Cook until black and smoky",
                        "etc"];

    const recipeTips = ["try adding chocoloate for an unusual twist",
                        "Don't forget to keep stirring to prevent it going lumpy",
                        "etc"];

    const recipeSpiel = ["This recipe always reminds me of my mum, who cooks it a lot. In my house there was nothing more summery than a smoky bowl of Spicy Tomato Pasta  etc"]

export default {recipeData, recipeDataObject, recipeIngredients, recipeMethod, recipeTips, recipeSpiel};