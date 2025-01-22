import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './components/firebaseConfig'; // Adjust import path based on your project structure
import Login from './components/Login';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import Leaderboard from './components/Leaderboard';
import './App.css'; // Optional: Your app's styling

function App() {
  const [user, setUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out", error);
    }
  };

  return (
    <div className="App">
      {user ? (
        <div className="container">
          <Profile userId={user.uid} />
          <button onClick={handleLogout}>Logout</button>
          <Leaderboard />
        </div>
      ) : isSigningUp ? (
        <div className="container">
          <SignUp onSignUp={setUser} />
          <button onClick={() => setIsSigningUp(false)}>Back to Login</button>
        </div>
      ) : (
        <div className="container">
          <Login onLogin={setUser} />
          <button onClick={() => setIsSigningUp(true)}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default App;