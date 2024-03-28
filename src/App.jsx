import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./pages/Account";
import HomePage from "./pages/HomePage";
import RecipeEntryPage from "./pages/RecipeEntryPage";
import UserRecipesPage from "./pages/UserRecipesPage";
import AddIngredientsPage from "./pages/AddIngredientsPage";
import RecipePage from "./pages/RecipePage";

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
            <Route path="/my-recipes" element={<UserRecipesPage supabase={supabase} />} />
            <Route path="/add-recipe" element={<RecipeEntryPage supabase={supabase} />} />
            <Route path="/add-ingredients" element={<AddIngredientsPage />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/account" element={<Account key={session.user.id} session={session} />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
