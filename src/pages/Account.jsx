import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import './Account.css';

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(event, avatarUrl) {
    event.preventDefault();
  
    setLoading(true);
    const { user } = session;
  
    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl, // use the avatarUrl parameter
      updated_at: new Date(),
    };
  
    const { error } = await supabase.from("profiles").upsert(updates);
  
    if (error) {
      alert(error.message);
    } else {
      // Download the image and set the object URL
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(avatarUrl);
      if (error) {
        console.log("Error downloading image: ", error.message);
      } else {
        const blob = await data.blob(); // Get the Blob object
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      }
    }
    setLoading(false);
  }

  return (
    <div className="account-page">
      <header>
        <nav>
          <ul className="menu">
            <li><Link to="/add-recipe">Add Recipe</Link></li>
            <li><Link to="/add-ingredients">Add Ingredients</Link></li>
            <li><Link to="/my-recipes">My Recipes</Link></li>
            <li><Link to="/">Page 4</Link></li> {/* Assuming you want to link to home for "Page 4" */}
            <li><Link to="/account">Account</Link></li>
          </ul>
        </nav>
        <div className="logo-container">
          <a href="/">
            <img src="src/assets/Dishconnect.PNG" alt="Logo" className="logo" />
          </a>
        </div>
      </header>
      <form onSubmit={updateProfile} className="form-widget">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            required
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="avatar">Avatar</label>
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(event, url) => updateProfile(url)} // Adjusted for clarity
          />
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <button
            className="button block primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>

        <div>
          <button
            className="button block"
            type="button"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
