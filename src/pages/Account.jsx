import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from "react-router-dom"; 
import Avatar from '../components/Avatar'
import './Account.css';
import Layout2 from "./Layout2"; 
import Layout from "./Layout"; 

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const navigate = useNavigate(); 

  useEffect(() => {
    async function getProfile() {
      setLoading(true)
      const { user } = session

      let { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error) {
        console.warn(error)
      } else if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }

      setLoading(false)
    }

    getProfile()
  }, [session])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()
  
    setLoading(true)
    const { user } = session
  
    // Check if the username is taken by someone else
    let { data: usernameData, error: usernameError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .not('id', 'eq', user.id) // Exclude the current user's profile from the check
  
    if (usernameError) {
      alert(usernameError.message)
      setLoading(false)
      return
    }
  
    // If usernameData is not empty, the username is taken
    if (usernameData.length > 0) {
      alert('Username is taken. Please choose another one.')
      setLoading(false)
      return
    }
  
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
          <label htmlFor="username">Name</label>
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
