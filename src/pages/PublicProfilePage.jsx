import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Layout from './Layout';
import RecipesList from '../components/RecipeList';
import './PublicProfilePage.css'; 

const PublicProfilePage = () => {
  const { id } = useParams(); // This is the profile_id from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setLoading(false);
        return;
      }

      setUser(userData);
      setLoading(false);
      setAvatarUrl(userData.avatar_url); // Set the avatar URL
    };

    fetchUserProfile();
  }, [id, supabase]);

  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/avatars';
    return `${baseUrl}/${imagePath}`;
  };

  return (
    <Layout>
      <div className='public-profile-page'>
        {user && (
          <>
            <h1>{`${user.username}'s Recipes`}</h1>
            <div className='profile-img-wrapper'>
              <img src={avatarUrl ? getFullImageUrl(avatarUrl) : "/src/assets/placeholder.png"} alt={`${user.username}'s profile`} style={{ maxWidth: '100%' }} />
            </div>
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

export default PublicProfilePage;



