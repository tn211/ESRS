import React, { useState, useEffect } from 'react'; // Importing React and necessary hooks
import { supabase } from '../../supabaseClient'; // Importing supabase client
import './RatingButtons.css' // Importing CSS file for styling

// RatingButtons component
const RatingButtons = ({ recipeId, session }) => {
    const [ratings, setRatings] = useState([]); // State to store ratings data
    const [averageRating, setAverageRating] = useState('Not yet rated'); // State to store average rating
    const [userRating, setUserRating] = useState(null); // State to store user's rating for the recipe
// Fetch ratings data when recipeId changes or component mounts
    useEffect(() => {
        fetchRatings();
    }, [recipeId]);
// Function to fetch ratings data from the database
    const fetchRatings = async () => {
        const { data, error } = await supabase
            .from('ratings')
            .select('*')
            .eq('recipe_id', recipeId);
      
        if (error) {
            console.error('Error fetching ratings:', error);
            return;
        }

        setRatings(data); // Update ratings state with fetched data
        updateAverageRating(data); // Update average rating based on fetched data
        updateUserRating(data); // Update user's rating based on fetched data
    };
// Function to update user's rating for the recipe
    const updateUserRating = (data) => {
        const ratingFromUser = data.find(r => r.profile_id === session.user.id);
        if (ratingFromUser) {
            setUserRating(ratingFromUser.rating);
        } else {
            setUserRating(null);
        }
    };
// Function to handle rating submission
    const handleRating = async (rating) => {
        if (!session || !session.user) {
            alert("You must be logged in to rate recipes.");
            return;
        }

        const existingRating = ratings.find(r => r.profile_id === session.user.id);
        const updatedRating = { recipe_id: recipeId, profile_id: session.user.id, rating };

        let error;
        if (existingRating) {
            ({ error } = await supabase
                .from('ratings')
                .update({ rating })
                .match({ recipe_id: recipeId, profile_id: session.user.id }));
        } else {
            ({ error } = await supabase
                .from('ratings')
                .insert([updatedRating]));
        }

        if (error) {
            console.error('Error updating rating:', error);
            return;
        }

        fetchRatings(); // Fetch ratings data after rating is updated
    };
// Function to calculate and update average rating
    const updateAverageRating = (ratings) => {
        if (ratings.length === 0) {
            setAverageRating("No ratings yet!");
            return;
        }

        const total = ratings.reduce((sum, record) => sum + record.rating, 0);
        const average = total / ratings.length;
        setAverageRating(average.toFixed(1));
    };
// Render rating buttons and current average rating
    return (
        <div>
            <h3>Rate:</h3>
            {[1, 2, 3, 4, 5].map(value => (
                <button
                    key={value}
                    onClick={() => handleRating(value)}
                    className={userRating === value ? 'highlighted' : ''}
                >
                    {value}
                </button>
            ))}
            <p>Current Rating: {averageRating}</p>
        </div>
    );
};

export default RatingButtons; // Export RatingButtons component



// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../supabaseClient';

// const RatingButtons = ({ recipeId, session }) => {
//     const [ratings, setRatings] = useState([]);
//     const [averageRating, setAverageRating] = useState('Not yet rated');

//     useEffect(() => {
//         fetchRatings();
//     }, [recipeId]);

//     const fetchRatings = async () => {
//         const { data, error } = await supabase
//             .from('ratings')
//             .select('*')
//             .eq('recipe_id', recipeId);
      
//         if (error) {
//             console.error('Error fetching ratings:', error);
//             return;
//         }

//         setRatings(data);
//         updateAverageRating(data);
//     };

//     const handleRating = async (rating) => {
//         if (!session || !session.user) {
//             alert("You must be logged in to rate recipes.");
//             return;
//         }

//         const existingRating = ratings.find(r => r.profile_id === session.user.id);
//         const updatedRating = { recipe_id: recipeId, profile_id: session.user.id, rating };

//         let error;
//         if (existingRating) {
//             ({ error } = await supabase
//                 .from('ratings')
//                 .update({ rating })
//                 .match({ recipe_id: recipeId, profile_id: session.user.id }));
//         } else {
//             ({ error } = await supabase
//                 .from('ratings')
//                 .insert([updatedRating]));
//         }

//         if (error) {
//             console.error('Error updating rating:', error);
//             return;
//         }

//         fetchRatings();
//     };

//     const updateAverageRating = (ratings) => {
//         if (ratings.length === 0) {
//             setAverageRating("No ratings yet!");
//             return;
//         }

//         const total = ratings.reduce((sum, record) => sum + record.rating, 0);
//         const average = total / ratings.length;
//         setAverageRating(average.toFixed(1));
//     };

//     return (
//         <div>
//             <h3>Rate:</h3>
//             {[1, 2, 3, 4, 5].map(value => (
//                 <button key={value} onClick={() => handleRating(value)}>{value}</button>
//             ))}
//             <p>Current Rating: {averageRating}</p>
//         </div>
//     );
// };

// export default RatingButtons;

