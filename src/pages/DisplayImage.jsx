import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from "react-router-dom";
import Image from '../components/Image'
import './Account.css';
import Layout from "./Layout";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [recipeURL, setRecipeURL] = useState(null)

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('recipes')
        .select(`title, image_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setTitle(data.title)
          setImageUrl(data.image_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event, recipeURL) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id: user.id,
      title,    
      image_url: recipeURL,
    }

    const { error } = await supabase.from('recipes').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setRecipeURL(recipeURL)
    }
    setLoading(false)
  }

  return (
    <Layout>
      <form onSubmit={updateProfile} className="form-widget">
          <Image
              url={recipeURL}
              size={150}
              onUpload={(event, url) => {
                  updateProfile(event, url)
              }}
          />

        <div>
          <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
        <div>
        <Link to="/">Back to Home</Link>
        </div>
      </form>
    </Layout>
  )
}