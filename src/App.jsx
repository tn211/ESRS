import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import HomePage from "./pages/HomePage";
import Account from "./pages/Account";
import RecipeEntryPage from "./pages/RecipeEntryPage";
import UserRecipesPage from "./pages/UserRecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import AboutUs from "./pages/AboutUs";
import RecentRecipesPage from "./pages/RecentRecipesPage";
import SearchPage from "./pages/search-page/SearchPage";
import UserFavouritesPage from "./pages/UserFavourites";
import DisplayImage from "./pages/DisplayImage";
import RecipeImageUpload from "./pages/RecipeImageUpload";


function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<SearchPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/my-recipes" element={<UserRecipesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/favourites" element={<UserFavouritesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/recipes/:recipeId" element={<RecipeDetail key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/recent-recipes" element={<RecentRecipesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/add-recipe" element={<RecipeEntryPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/search" element={<SearchPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/account" element={<Account key={session.user.id} session={session} />} />
            <Route path="/AboutUs" element={<AboutUs key={session.user.id} session={session} />} />
            <Route path="/display-image" element={<DisplayImage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/recipe-image-upload" element={<RecipeImageUpload key={session.user.id} session={session} supabase={supabase} />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
