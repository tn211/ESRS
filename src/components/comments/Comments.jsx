import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Comments = ({ recipeId, session }) => {
    const [comments, setComments] = useState([]);
    const [newCommentBody, setNewCommentBody] = useState('');

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    const fetchComments = async () => {
        const { data: commentsData, error } = await supabase
            .from('comments')
            .select(`
                *,
                user_id!inner(username)
            `)
            .eq('slug', recipeId);

        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }

        setComments(commentsData);
    };

    const handleCommentChange = (e) => {
        setNewCommentBody(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!session || !session.user) {
            alert("You must be logged in to post a comment.");
            return;
        }

        const { error } = await supabase
            .from('comments')
            .insert([
                { slug: recipeId, body: newCommentBody, user_id: session.user.id, created_at: new Date().toISOString() }
            ]);

        if (error) {
            console.error('Error posting comment:', error);
            return;
        }

        setNewCommentBody('');
        fetchComments(); // Re-fetch comments to show the new comment immediately
    };

    return (
        <div>
            <h3>Comments:</h3>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}>
                        <p>{comment.body}</p>
                        <small>{comment.user_id.username}</small>
                        <small>{new Date(comment.created_at).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
            <form className='rsc' onSubmit={handleCommentSubmit}>
                <textarea value={newCommentBody} onChange={handleCommentChange} placeholder="Write a comment..." required />
                <button type="submit">Post Comment</button>
            </form>
        </div>
    );
};

export default Comments;
