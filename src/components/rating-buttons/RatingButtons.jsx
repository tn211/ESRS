import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const RatingButtons = ({ recipeId, session }) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState('Not yet rated');

    useEffect(() => {
        fetchRatings();
    }, [recipeId]);

    const fetchRatings = async () => {
        const { data, error } = await supabase
            .from('ratings')
            .select('*')
            .eq('recipe_id', recipeId);
      
        if (error) {
            console.error('Error fetching ratings:', error);
            return;
        }

        setRatings(data);
        updateAverageRating(data);
    };

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

        fetchRatings();
    };

    const updateAverageRating = (ratings) => {
        if (ratings.length === 0) {
            setAverageRating("No ratings yet!");
            return;
        }

        const total = ratings.reduce((sum, record) => sum + record.rating, 0);
        const average = total / ratings.length;
        setAverageRating(average.toFixed(1));
    };

    return (
        <div>
            <h3>Rate:</h3>
            {[1, 2, 3, 4, 5].map(value => (
                <button key={value} onClick={() => handleRating(value)}>{value}</button>
            ))}
            <p>Current Rating: {averageRating}</p>
        </div>
    );
};

export default RatingButtons;

