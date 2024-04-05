import React, { useState } from "react";
import 'C:/Users/yunus/ESRS/src/pages/RecipeForm.css';

const RecipeForm = ({ supabase }) => {
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image_url, setImageUrl] = useState("");

  // Hardcoded user_id for testing
  const user_id = 1; // ID of the test user

  const handleSubmit = async (e) => {
    console.log('Form submitted', { title, description, instructions, image_url});
    e.preventDefault();

    const { data, error } = await supabase.from("recipes").insert([
      {
        //user_id, // Use the hardcoded test user's ID
        //yz note: order of entry in supabase column. Cut out user_id
        // as this is not first column in table
        title,
        servings,
        description,
        instructions,
        image_url,
      },
    ]);

    if (error) {
      console.error(error.message);
    } else {
      alert("Recipe added successfully!");
      // Assuming `data` contains the inserted records and that the ID is accessible
      // This might need to be adjusted based on your actual API response
      if (data && data.length > 0) {
        onRecipeSubmitted(data[0].id); // Call the callback function with the new recipe ID
      }
      // Optionally reset form fields or handle success (e.g., redirect)
      setTitle("");
      setServings("");
      setDescription("");
      setInstructions("");
      setImageUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title" className="label"> Recipe Title</label>
        <input
          id="title"
          type="text"
          value={title}
          placeholder="Name of Recipe"
          className="input"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
        <div className="form-group">
        <label htmlFor="servings" className="label" >Number of Servings</label>
        <input
        id="servings"
        type="number" // Number Input
        value={servings}
        placeholder="Number of Servings"
        onChange={(e) => setServings(e.target.Value)}
        className="input"
        />
        </div>
      <div className="form-group">
        <label htmlFor="description" className = "label" >Description</label>
        <textarea
          id="description"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="instructions" className="label" >Instructions</label>
        <textarea
          id="instructions"
          value={instructions}
          placeholder="Instructions"
          onChange={(e) => setInstructions(e.target.value)}
          className="input"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="image_url" className="label" >Image URL</label>
        <input
          id="image_url"
          type="text"
          value={image_url}
          placeholder="Image URL"
          onChange={(e) => setImageUrl(e.target.value)}
          className="input"
        />
      </div>
      <div className="form-group">
        <button type="submit" className="button"> Submit</button>
      </div>
    </form>
  );
};

export default RecipeForm;
