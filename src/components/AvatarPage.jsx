import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AvatarPage({ session }) {
  console.log('AvatarPage rendered'); 
  const [avatarUrl, setAvatarUrl] = useState(null);

  console.log('avatarUrl', avatarUrl); 

  useEffect(() => {
    async function getProfile() {
      if (session) {
        const { user } = session;
    
        const { data, error } = await supabase
          .from('profiles')
          .select(`avatar_url`)
          .eq('id', user.id)
          .single();
    
        console.log('getProfile data', data); // Add this line
        console.log('getProfile error', error); // Add this line
    
        if (error) {
          console.warn(error);
        } else if (data && data.avatar_url) {
          downloadImage(data.avatar_url);
        }
      }
    }
    
    async function downloadImage(path) {
      const { data, error } = await supabase.storage.from('avatars').download(path);
    
      console.log('downloadImage data', data); // Add this line
      console.log('downloadImage error', error); // Add this line
    
      if (error) {
        console.warn('Error downloading image: ', error.message);
      } else {
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      }
    }

    getProfile();
  }, [session]);

  return (
    <div>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" />
      ) : (
        <p>No avatar</p>
      )}
    </div>
  );
}