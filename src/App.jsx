import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import HomePage from './pages/HomePage';
import RecipeEntryPage from './pages/RecipeEntryPage';
import UserRecipesPage from './pages/UserRecipesPage'; 

const supabaseUrl = 'https://wjrqqfjolcpxmlzwxxbj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcnFxZmpvbGNweG1send4eGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcwOTY1MDksImV4cCI6MjAyMjY3MjUwOX0.bCIIyngIq6xLTZxpMcutiSYkmCL7ldYxNYF5OF7Z-10';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/my-recipes" element={<UserRecipesPage supabase={supabase} />} />
        <Route path="/add-recipe" element={<RecipeEntryPage supabase={supabase} />} />
      </Routes>
    </Router>
  );
}

export default App;
