import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';

function PublicProfilePage() {
  const { id } = useParams(); // This retrieves the id parameter from the URL

  // You can use this ID to fetch the user data from the database here

  return (
    <Layout>
      <h1>PROFILE PAGE</h1>
      <p>Profile ID: {id}</p>  {/* Display the ID, or fetched user details */}
    </Layout>
  );
}

export default PublicProfilePage;
