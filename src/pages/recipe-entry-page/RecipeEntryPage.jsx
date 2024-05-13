import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../supabaseClient";
import Layout2 from "../../components/layout-components/Layout2";
import { useNavigate } from "react-router-dom";
import "./RecipeEntryPage.css";

const RecipeEntryPage = ({ session }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [steps, setSteps] = useState([{ instruction: "" }]);
  const [imageUrl, setImageUrl] = useState(null);
  const [prepTime, setPrepTime] = useState({ hours: 0, minutes: 0 });
  const [cookTime, setCookTime] = useState({ hours: 0, minutes: 0 });
  const navigate = useNavigate();

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredientField = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStepField = () => {
    setSteps([...steps, { instruction: "" }]);
  };

  const removeStepField = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    const totalPrepTime =
      parseInt(prepTime.hours) * 60 + parseInt(prepTime.minutes);
    const totalCookTime =
      parseInt(cookTime.hours) * 60 + parseInt(cookTime.minutes);

    try {
      // Handle image upload
      if (data.image.length > 0) {
        const file = data.image[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        data.image_url = filePath; // Save image path for further reference in the recipe
      }

      // Insert the recipe and retrieve the recipe ID
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          title: data.title,
          description: data.description,
          prep_time: totalPrepTime,
          cook_time: totalCookTime,
          profile_id: session.user.id,
          created_at: new Date().toISOString(),
          image_url: data.image_url,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      const recipeId = recipeData.recipe_id;

      // Insert ingredients using the retrieved recipe ID
      for (const ingredient of data.ingredients) {
        const { error: ingredientError } = await supabase
          .from("ingredients")
          .insert({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            recipe_id: recipeId,
            profile_id: session.user.id,
          });

        if (ingredientError) throw ingredientError;
      }

      // Insert steps using the retrieved recipe ID
      let stepNumber = 1;
      for (const step of data.steps) {
        const { error: stepError } = await supabase.from("steps").insert({
          instruction: step.instruction,
          recipe_id: recipeId,
          step_number: stepNumber++, // Increment step_number for each step
        });

        if (stepError) throw stepError;
      }

      // Redirect to the RecipeDetail page for the newly added recipe
      navigate(`/recipes/${recipeId}`);
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Submission error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Layout2>
        <div className="recipe-entry-page">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Title</label>
              <input type="title" {...register("title", { required: true })} />
            </div>
            <div>
              <label htmlFor="image">Recipe Image</label>
              <input
                type="file"
                {...register("image", { required: true })}
                id="image"
              />
            </div>
            <div>
              <label>Prep Time (Hours)</label>
              <input
                type="number"
                value={prepTime.hours}
                onChange={(e) =>
                  setPrepTime({ ...prepTime, hours: e.target.value })
                }
              />
              <label>Prep Time (Minutes)</label>
              <input
                type="number"
                value={prepTime.minutes}
                onChange={(e) =>
                  setPrepTime({ ...prepTime, minutes: e.target.value })
                }
              />
            </div>
            <div>
              <label>Cook Time (Hours)</label>
              <input
                type="number"
                value={cookTime.hours}
                onChange={(e) =>
                  setCookTime({ ...cookTime, hours: e.target.value })
                }
              />
              <label>Cook Time (Minutes)</label>
              <input
                type="number"
                value={cookTime.minutes}
                onChange={(e) =>
                  setCookTime({ ...cookTime, minutes: e.target.value })
                }
              />
            </div>
            <div>
              <label>Description</label>
              <textarea {...register("description", { required: true })} />
            </div>
            {steps.map((step, index) => (
              <div key={index}>
                <textarea
                  {...register(`steps[${index}].instruction`, {
                    required: true,
                  })}
                  placeholder="Step Instruction"
                />
                <button type="button" onClick={() => removeStepField(index)}>
                  Remove Step
                </button>
              </div>
            ))}
            <button type="button" onClick={addStepField}>
              Add Step
            </button>
            {ingredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="text"
                  {...register(`ingredients[${index}].name`, {
                    required: true,
                  })}
                  placeholder="Ingredient Name"
                />
                <input
                  {...register(`ingredients[${index}].quantity`, {
                    required: "Quantity is required",
                    valueAsNumber: true,
                    validate: {
                      isFloat: (value) =>
                        !isNaN(value) &&
                        Number(value) === value &&
                        (!/\.\d{3,}/.test(value) ||
                          "Please limit to 2 decimal places"),
                    },
                  })}
                  type="number"
                  step="0.01" // Allow decimal values up to 2 decimal places
                  placeholder="Quantity"
                />
                <select
                  {...register(`ingredients[${index}].unit`, {
                    required: true,
                  })}
                >
                  <option value="">Select Unit</option>
                  <option value="whole">whole</option>
                  <option value="tsp">tsp</option>
                  <option value="tbsp">tbsp</option>
                  <option value="pinch">pinch</option>
                  <option value="g">g</option>
                  <option value="mL">mL</option>
                  <option value="L">L</option>
                  <option value="oz">oz</option>
                  <option value="lb">lb</option>
                  <option value="cups">cups</option>
                  <option value="pints">pints</option>
                  <option value="quarts">quarts</option>
                  <option value="gallons">gallons</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeIngredientField(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredientField}>
              Add Ingredient
            </button>
            <button type="submit" disabled={submitting}>
              Submit Recipe
            </button>
          </form>
        </div>
      </Layout2>
    </>
  );
};

export default RecipeEntryPage;
