import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./pages/Account";
import HomePage from "./pages/HomePage";
import RecipeEntryPage from "./pages/RecipeEntryPage";
import UserRecipesPage from "./pages/UserRecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import RecentRecipesPage from "./pages/RecentRecipesPage";
import Image from "./components/Image";

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
            <Route path="/" element={<HomePage />} />
            <Route path="/my-recipes" element={<UserRecipesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/recipes/:recipeId" element={<RecipeDetail key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/recent-recipes" element={<RecentRecipesPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/add-recipe" element={<RecipeEntryPage key={session.user.id} session={session} supabase={supabase} />} />
            <Route path="/account" element={<Account key={session.user.id} session={session} />} />
            <Route path="/recipe-image-upload" element={<Image key={session.user.id} session={session} supabase={supabase} />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
