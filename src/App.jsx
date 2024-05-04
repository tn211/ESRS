import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
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
import ProtectedRoute from "./components/protected-route/ProtectedRoute";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log("Initial session:", session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Auth state changed:", session);
    });
  }, []);

  const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("Error signing in anonymously:", error);
    } else {
      setSession(data.session);
    }
  };

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth signInAnonymously={signInAnonymously} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<SearchPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/my-recipes" element={<ProtectedRoute session={session}><UserRecipesPage key={session.user.id} session={session} supabase={supabase} /></ProtectedRoute>} />
            <Route path="/favourites" element={<ProtectedRoute session={session}><UserFavouritesPage key={session.user.id} session={session} supabase={supabase} /></ProtectedRoute>} />
            <Route path="/recipes/:recipeId" element={<ProtectedRoute session={session} allowAnonymous={true}><RecipeDetail key={session.user.id} session={session} supabase={supabase} /></ProtectedRoute>} />
            <Route path="/chefs/:id" element={<ProtectedRoute session={session} allowAnonymous={true}><PublicProfilePage key={session.user.id} session={session} supabase={supabase} /></ProtectedRoute>} />
            <Route path="/recent-recipes" element={<ProtectedRoute session={session} allowAnonymous={true}><RecentRecipesPage key={session.user.id} session={session} supabase={supabase} /></ProtectedRoute>} />
            <Route path="/add-recipe" element={<ProtectedRoute session={session}><RecipeEntryPage key={session.user.id} session={session} supabase={supabase} /></ProtectedRoute>} />
            <Route
  path="/search"
  element={
    <ProtectedRoute session={session} allowAnonymous={true}>
      <SearchPage key={session?.user?.id} session={session} supabase={supabase} />
    </ProtectedRoute>
  }
/>
            <Route path="/following" element={<ProtectedRoute session={session}><FollowingPage key={session.user.id} session={session} supabase={supabase} /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute session={session}><Account key={session.user.id} session={session} /></ProtectedRoute>} />
            <Route path="/about-us" element={<AboutUs key={session.user.id} session={session} />} />
            <Route path="/auth" element={<Auth signInAnonymously={signInAnonymously} />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
