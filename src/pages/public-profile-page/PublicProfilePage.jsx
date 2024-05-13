// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Layout from '../../components/layout-components/Layout';
import './PublicProfilePage.css';
import RecipesList from '../../components/recipe-list/RecipeList';
// Component for displaying a public user profile
const PublicProfilePage = ({ session }) => {
  // Extract the profile ID from the URL parameters
  const { id } = useParams(); // This is the profile_id from the URL
  const [user, setUser] = useState(null);
  // State to manage the loading state of user data
  const [loading, setLoading] = useState(true);
  // State to store the URL of the user's avatar
  const [avatarUrl, setAvatarUrl] = useState('');
  // State to track if the current user is following the profile user
  const [isFollowing, setIsFollowing] = useState(false);

// Effect hook to fetch user data and check following status on component mount or when id/session changes
  useEffect(() => {
    fetchUserProfile();
    checkFollowing();
  }, [id, session]);
// Function to fetch the user profile from the database
  const fetchUserProfile = async () => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
    }

    setUser(userData);
    setAvatarUrl(userData.avatar_url); // Set the avatar URL
    setLoading(false);
  };
// Function to check if the current user is following the viewed profile
  const checkFollowing = async () => {
    if (session && session.user) {
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', session.user.id)
        .eq('follow_target_id', id);

      if (error) {
        console.error('Error checking follow status:', error);
      } else {
        setIsFollowing(data.length > 0);
      }
    }
  };
// Function to toggle the follow/unfollow status
  const toggleFollow = async () => {
    if (!session || !session.user) {
      alert("You must be logged in to follow users.");
      return;
    }

    const { error } = isFollowing ?
      await supabase.from('follows').delete().eq('follower_id', session.user.id).eq('follow_target_id', id) :
      await supabase.from('follows').insert([{ follower_id: session.user.id, follow_target_id: id }]);

    if (error) {
      console.error('Error updating follow status:', error);
    } else {
      setIsFollowing(!isFollowing);
    }
  };
// Helper function to generate the full image URL
  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/avatars';
    return `${baseUrl}/${imagePath}`;
  };
// JSX to render the component
  return (
    <Layout>
      <div className='public-profile-page'>
        {user && (
          <>
            <h1>{`${user.username}'s Recipes`}</h1>
            <div className='profile-img-wrapper'>
              <img src={avatarUrl ? getFullImageUrl(avatarUrl) : "/src/assets/profile-placeholder.png"} alt={`${user.username}'s profile`} style={{ maxWidth: '100%' }} />
            </div>
            <button onClick={toggleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            {!loading ? (
              <RecipesList supabase={supabase} userId={id} /> // Pass userId to RecipesList
            ) : (
              <p>Loading recipes...</p>
            )}
          </>
        )}
        {loading && <p>Loading user...</p>}
      </div>
    </Layout>
  );
};
// Export the component for use in other parts of the application
export default PublicProfilePage;
