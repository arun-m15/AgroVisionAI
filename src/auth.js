import React, { useState } from "react";
import { auth } from "./firebase"; // Import Firebase Auth

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register

  // Function for handling login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Redirect to home/dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      setError(error.message);
    }
  };

  // Function for handling registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      // Redirect to login page after successful registration
      window.location.href = "/login";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {/* Toggle between login and register based on state */}
      {isRegistering ? (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Register</button>
            <p>Already have an account? <span onClick={() => setIsRegistering(false)}>Login here</span></p>
            {error && <p>{error}</p>}
          </form>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Login</button>
            <p>Don't have an account? <span onClick={() => setIsRegistering(true)}>Register here</span></p>
            {error && <p>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default Auth;
