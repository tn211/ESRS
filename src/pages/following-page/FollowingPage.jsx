import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Layout from '../../components/layout-components/Layout';
import './FollowingPage.css';

const FollowingPage = ({ session }) => {
  const [followingProfiles, setFollowingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowingProfiles = async () => {
      if (!session || !session.user) {
        console.log("Session or session.user is not available");
        setLoading(false);
        return;
      }

      const profileId = session.user.id;
      const { data: followsData, error: followsError } = await supabase
        .from('follows')
        .select('follow_target_id')
        .eq('follower_id', profileId);

      if (followsError) {
        console.error('Error fetching following data:', followsError);
        setLoading(false);
        return;
      }

      if (followsData.length === 0) {
        setLoading(false);
        return;
      }

      const followTargetIds = followsData.map(follow => follow.follow_target_id);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', followTargetIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setLoading(false);
        return;
      }

      setFollowingProfiles(profilesData);
      setLoading(false);
    };

    fetchFollowingProfiles();
  }, [session]);


  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/avatars';
    return imagePath ? `${baseUrl}/${imagePath}` : "/src/assets/placeholder.png";
  };


  return (
    <Layout>
      <div className='following-page'>
        <h1>People I'm Following</h1>
        {loading ? (
          <p>Loading profiles...</p>
        ) : (
          followingProfiles.length > 0 ? (
            <ul>
              {followingProfiles.map((profile) => (
                <li key={profile.id}>
                  <Link to={`/chefs/${profile.id}`}>
                    <div className='following-img-wrapper'><img src={getFullImageUrl(profile.avatar_url)} alt={`${profile.username}'s profile`}/></div>
                    <span>{profile.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>You are not following anyone.</p>
          )
        )}
      </div>
    </Layout>
  );
};

export default FollowingPage;
