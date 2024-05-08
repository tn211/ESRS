import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Layout2 from '../../components/layout-components/Layout2';
import './FollowingPage.css';

// define component to display followed users
const FollowingPage = ({ session }) => {
  // state for storing profiles and loading status
  const [followingProfiles, setFollowingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // effect to fetch followed profiles on component mount or session change
  useEffect(() => {
    const fetchFollowingProfiles = async () => {
      // check if session exists and is valid
      if (!session || !session.user) {
        console.log("Session or session.user is not available");
        setLoading(false);
        return;
      }

      // fetch ids of followed users
      const profileId = session.user.id;
      const { data: followsData, error: followsError } = await supabase
        .from('follows')
        .select('follow_target_id')
        .eq('follower_id', profileId);

      // handle possible errors during fetching
      if (followsError) {
        console.error('Error fetching following data:', followsError);
        setLoading(false);
        return;
      }

      // check if user follows anyone
      if (followsData.length === 0) {
        setLoading(false);
        return;
      }

      // extract ids of followed profiles
      const followTargetIds = followsData.map(follow => follow.follow_target_id);

      // fetch full profile details of followed users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', followTargetIds);

      // handle possible errors during profile fetching
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setLoading(false);
        return;
      }

      // update state with fetched profiles and set loading to false
      setFollowingProfiles(profilesData);
      setLoading(false);
    };

    fetchFollowingProfiles();
  }, [session]);

  // function to construct full image URL
  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/avatars';
    return imagePath ? `${baseUrl}/${imagePath}` : "/src/assets/placeholder.png";
  };

  // render the component with conditionally displayed content
  return (
    <Layout2>
      <div className='following-page'>
        <h1>Following</h1>
        {loading ? (
          <p>Loading profiles...</p>
        ) : (
          followingProfiles.length > 0 ? (
            <ul>
              {followingProfiles.map((profile) => (
                <li key={profile.id}>
                  <Link to={`/chefs/${profile.id}`}>
                    <div className='following-img-wrapper'><img src={getFullImageUrl(profile.avatar_url)} alt={`${profile.username}'s profile`} /></div>
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
    </Layout2>
  );
};

export default FollowingPage;
