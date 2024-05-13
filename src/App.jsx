// Importing CSS file for styling
import "./App.css";
// Importing necessary hooks and components from React and React Router
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Importing Supabase client
import { supabase } from "./supabaseClient";
// Importing authentication component
import Auth from "./Auth";
// Importing page components
import Account from "./pages/account-page/Account";
import RecipeEntryPage from "./pages/recipe-entry-page/RecipeEntryPage";
import UserRecipesPage from "./pages/my-recipes-page/UserRecipesPage";
import RecipeDetail from "./pages/recipe-detail-page/RecipeDetail";
import AboutUs from "./pages/about-us-page/AboutUs";
import RecentRecipesPage from "./pages/community-page/RecentRecipesPage";
import SearchPage from "./pages/search-page/SearchPage";
import UserFavouritesPage from "./pages/favorites-page/UserFavourites";
import PublicProfilePage from "./pages/public-profile-page/PublicProfilePage";
import FollowingPage from "./pages/following-page/FollowingPage";

function App() {
  const [session, setSession] = useState(null); // State to hold user session

  useEffect(() => {
    // Fetching user session when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // Listening for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {/* Rendering authentication component if no session */}
      {!session ? (
        <Auth />
      ) : (
        <Router>
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/" element={<SearchPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/my-recipes" element={<UserRecipesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/favourites" element={<UserFavouritesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/recipes/:recipeId" element={<RecipeDetail key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/chefs/:id" element={<PublicProfilePage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/recent-recipes" element={<RecentRecipesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/add-recipe" element={<RecipeEntryPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/search" element={<SearchPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/following" element={<FollowingPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/account" element={<Account key={session.user.id} session={session} />} />
            <Route path="/about-us" element={<AboutUs key={session.user.id} session={session} />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}
// Exporting App component
export default App;
