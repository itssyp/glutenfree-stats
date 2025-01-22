import React, { useState } from 'react';
import { auth, db } from './firebaseConfig'; // Make sure your paths are correct
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const usernameDocRef = doc(db, 'usernameMapping', username);
        const usernameDoc = await getDoc(usernameDocRef);
  
        if (!usernameDoc.exists()) {
          throw new Error("Username does not exist");
        }
  
        const { email } = usernameDoc.data();
  
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user);
  
      } catch (error) {
        setError(error.message);
      }
    };
  
    return (
      <div>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="container">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

export default Login;