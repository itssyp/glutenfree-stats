import React, { useState } from 'react';
import { auth, db } from './firebaseConfig'; // Ensure this path is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SignUp = ({ onSignUp }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      setError('Nincs apelláta, fogadd csak el');
      return;
    }

    try {
      const usernameDocRef = doc(db, 'usernameMapping', username);
      const usernameDoc = await getDoc(usernameDocRef);
      
      if (usernameDoc.exists()) {
        throw new Error('A felhasználónév foglalt');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'stats', user.uid), {
        name: username,
        itemCounters: {
          beer: 0,
          shot: 0,
          slug: 0,
          vine: 0
        }
      });

      await setDoc(usernameDocRef, { email });

      onSignUp(user);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Regisztráció</h2>
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
          placeholder="Felhasználónév"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Jelszó"
          required
        />
        <div>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            id="terms"
          />
          <label htmlFor="terms"> Elfogadom az általános felhasználó feltételeket</label>
        </div>
        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
};

export default SignUp;