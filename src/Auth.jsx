import { useState } from "react";
import { supabase } from "./supabaseClient"; // Importing Supabase client

export default function Auth() {
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [email, setEmail] = useState(""); // State to manage email input value

  // Function to handle login
  const handleLogin = async (event) => {
    event.preventDefault(); // Preventing default form submission behavior

    setLoading(true); // Setting loading state to true
    const { error } = await supabase.auth.signInWithOtp({ email }); // Signing in with OTP

    if (error) {
      alert(error.error_description || error.message); // Alerting error message if any
    } else {
      alert("Check your email for the login link!"); // Alerting success message
    }
    setLoading(false); // Setting loading state to false
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">DishConnect</h1>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button className={"button block"} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
