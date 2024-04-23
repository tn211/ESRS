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

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setLoading(false);
        return;
      }

      setUser(userData);
      setLoading(false);
    };

    fetchUserProfile();
  }, [id, supabase]);

  return (
    <Layout>
      <div className='public-profile-page'>
        <h1>{user ? `${user.username}'s Recipes` : "Loading user..."}</h1>
        {!loading ? (
          <RecipesList supabase={supabase} userId={id} /> // Pass userId to RecipesList
        ) : (
          <p>Loading recipes...</p>
        )}
      </div>
    </Layout>
  );
};

export default PublicProfilePage;

