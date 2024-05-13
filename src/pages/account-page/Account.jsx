import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate } from "react-router-dom"; 
import './Account.css';
import Layout from '../../components/layout-components/Layout';
import Avatar from '../../components/avatar/Avatar';

// Define the functional component named Account with a proper 'session' to handle the user's session //
export default function Account({ session }) { // State variables to manage user data and loading state //
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const navigate = useNavigate(); // Initialise the navigate function from useNavigate hook //
// useEffect to load the user profile from the database when the component mounts //
  useEffect(() => {
    async function getProfile() {
      setLoading(true)
      const { user } = session // Destructure user from session //

      let { data, error } = await supabase // Query the 'profiles' table in Supabase to get user data //
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error) { // Error handling and updating state with fetched data //
        console.warn(error)
      } else if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }

      setLoading(false) // Set loading state to false after data is loaded //
    }

    getProfile()
  }, [session]) // Effect depends on session

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()
  
    setLoading(true)
    const { user } = session
  
    // check if the username is taken by someone else
    let { data: usernameData, error: usernameError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .not('id', 'eq', user.id) // exclude the current user's profile from the check
  
    if (usernameError) {
      alert(usernameError.message)
      setLoading(false)
      return
    }
  
    // if usernameData is not empty, the username is taken
    if (usernameData.length > 0) {
      alert('Username is taken. Please choose another one.')
      setLoading(false)
      return
    }
  // Prepare the updated user profile data // 
    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }
  
    let { error } = await supabase.from('profiles').upsert(updates)
  
    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }
// JSX for rendering the account management form //
  return (
    <Layout>
      <form onSubmit={updateProfile} className="form-widget">
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(event, url) => {
            updateProfile(event, url)
          }}
        />
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <button className="button block primary" type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>

        <div>
          <button className="button block" type="button" onClick={() => navigate("/") }>
            Back To Home
          </button>
        </div>
      </form>
    </Layout>
  )
}
