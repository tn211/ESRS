import React, { useState, useEffect } from 'react';
import './App.css'; 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjrqqfjolcpxmlzwxxbj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcnFxZmpvbGNweG1send4eGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcwOTY1MDksImV4cCI6MjAyMjY3MjUwOX0.bCIIyngIq6xLTZxpMcutiSYkmCL7ldYxNYF5OF7Z-10';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');
    
    if (error) console.error(error);
    else setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        { description, amount: parseFloat(amount), expense_date: new Date().toISOString() }
      ]);
    
    if (error) console.error('Error inserting data:', error);
    else {
      setDescription('');
      setAmount('');
      fetchExpenses(); // Refresh the list of expenses
    }
  };

  return (
    <div className="container">
      <h1>DishConnect</h1>
      <p>Please enter Ingredient Names and Quantities:</p>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Ingredient Name"
        />
        <input
          className="input"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder="Quantity (grams)"
          type="number"
        />
        <button type="submit">Add Ingredient</button>
      </form>
      <div className="scrollView">
        {expenses.map((expense, index) => (
          <div key={index} className="expenseItem">
            {expense.description}: {expense.amount}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
