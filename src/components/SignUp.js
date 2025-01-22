import React, { useState } from 'react';
import { auth, db } from './firebaseConfig'; // Ensure this path is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SignUp = ({ onSignUp }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSignUp = async (e) => {
      e.preventDefault();
      
      try {
        const usernameDocRef = doc(db, 'usernameMapping', username);
        const usernameDoc = await getDoc(usernameDocRef);
        
        if (usernameDoc.exists()) {
          throw new Error('Username already taken');
        }
  
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        await setDoc(doc(db, 'users', user.uid), {
          name: username,
          itemCounters: {}
        });
  
        await setDoc(usernameDocRef, { email });
  
        onSignUp(user);
  
      } catch (error) {
        setError(error.message);
      }
    };
  
    return (
      <div>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp} className="container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  };

export default SignUp;