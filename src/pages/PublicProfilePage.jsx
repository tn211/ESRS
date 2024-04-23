import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';

function PublicProfilePage({ session, supabase }) {
  const { id } = useParams(); // Retrieve the chef ID from URL

  // Optional: code to fetch chef's profile using `id` and `supabase`

  return (
    <Layout>
      <h1>Profile Page</h1>
      <p>Profile ID: {id}</p>
      {/* Further content */}
    </Layout>
  );
}

export default PublicProfilePage;

