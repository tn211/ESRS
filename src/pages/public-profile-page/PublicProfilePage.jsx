import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase, BASE_URL, avatarBucketPath } from "../../supabaseClient";
import Layout2 from "../../components/layout-components/Layout2";
import "./PublicProfilePage.css";
import RecipesList from "../../components/recipe-list/RecipeList";
import profileplaceholder from "../../assets/profile-placeholder.png";

const PublicProfilePage = ({ session }) => {
  const { id } = useParams(); // This is the profile_id from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    checkFollowing();
  }, [id, session]);

  const fetchUserProfile = async () => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    }

    setUser(userData);
    setAvatarUrl(userData.avatar_url); // Set the avatar URL
    setLoading(false);
  };

  const checkFollowing = async () => {
    if (session && session.user) {
      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", session.user.id)
        .eq("follow_target_id", id);

      if (error) {
        console.error("Error checking follow status:", error);
      } else {
        setIsFollowing(data.length > 0);
      }
    }
  };

  const toggleFollow = async () => {
    if (!session || !session.user) {
      alert("You must be logged in to follow users.");
      return;
    }

    const { error } = isFollowing
      ? await supabase
          .from("follows")
          .delete()
          .eq("follower_id", session.user.id)
          .eq("follow_target_id", id)
      : await supabase
          .from("follows")
          .insert([{ follower_id: session.user.id, follow_target_id: id }]);

    if (error) {
      console.error("Error updating follow status:", error);
    } else {
      setIsFollowing(!isFollowing);
    }
  };

  const getFullImageUrl = (imagePath) => {
    // const baseUrl =
    //   "https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/avatars";
    // return `${baseUrl}/${imagePath}`;
    return `${BASE_URL}/${avatarBucketPath}/${imagePath}`;
  };

  return (
    <Layout2>
      <div className="public-profile-page">
        {user && (
          <>
            <h1>{`${user.username}'s Recipes`}</h1>
            <div className="profile-img-wrapper">
              <img
                src={
                  avatarUrl ? getFullImageUrl(avatarUrl) : profileplaceholder
                }
                alt={`${user.username}'s profile`}
                style={{ maxWidth: "100%" }}
              />
            </div>
            <button onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
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
    </Layout2>
  );
};

export default PublicProfilePage;
