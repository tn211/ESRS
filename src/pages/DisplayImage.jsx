import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function DisplayImage({ url, size }) {
    const [recipeImageUrl, setRecipeImageUrl] = useState(null)
  
    useEffect(() => {
      if (url) downloadImage(url)
    }, [url])
  
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('recipe-images').download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setRecipeImageUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error.message)
      }
    }

    return (
        <div>
          {recipeImageUrl ? (
            <img
              src={recipeImageUrl}
              alt="Recipe Image"
              className="recipe-image"
              style={{ height: size, width: size }}
            />
          ) : (
            <div className="recipe-image no-image" style={{ height: size, width: size }} />
          )}
        </div>
      )
}


