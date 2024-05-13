import { supabase } from "../../supabaseClient"; // Importing supabase client

// Functional component for LogoutButton
function LogoutButton() {
  // Function to handle logout
  const handleLogout = async () => {
    // Calling signOut method from supabase auth module
    const { error } = await supabase.auth.signOut();
    // Handling error if any
    if (error) console.error("Error logging out:", error.message);
  };
// Render logout button
  return <button onClick={handleLogout}>Log out</button>;
}
// Exporting LogoutButton component
export default LogoutButton;
