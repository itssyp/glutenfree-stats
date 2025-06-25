import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, messaging, db } from './components/firebaseConfig';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import Login from './components/Login';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import Leaderboard from './components/Leaderboard';
import MenuToggle from './components/MenuToggle';
import PlayerMenu from './components/PlayerMenu';
import './App.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [nightMode, setNightMode] = useState(() => {
    const savedMode = localStorage.getItem('nightMode');
    return savedMode === 'true' || false;
  });

  useEffect(() => {
    localStorage.setItem('nightMode', nightMode);
  }, [nightMode]);

  const toggleNightMode = () => {
    setNightMode(!nightMode);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });


    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const registerToken = async () => {
      try {
        await Notification.requestPermission();
        const currentToken = await getToken(messaging, {
          vapidKey: 'REPLACE_WITH_YOUR_PUBLIC_VAPID_KEY'
        });
        if (currentToken) {
          await setDoc(doc(db, 'stats', user.uid), { fcmToken: currentToken }, { merge: true });
        }
      } catch (err) {
        console.error('Failed to get FCM token', err);
      }
    };

    registerToken();
  }, [user]);


  return (
    <div className='App'>
      {user ? (
        <div className="container">
          <MenuToggle userId={user.uid} />
          <PlayerMenu currentUserId={user.uid}/>
          <Profile userId={user.uid} />
          <Leaderboard />
        </div>
      ) : isSigningUp ? (
        <div className="container">
          <SignUp onSignUp={setUser} />
          <button onClick={() => setIsSigningUp(false)}>Vissza a bejelentkezéshez</button>
        </div>
      ) : (
        <div className="container">
          <Login onLogin={setUser} />
          <button onClick={() => setIsSigningUp(true)}>Regisztráció</button>
        </div>
      )}
    </div>
  );
}

export default App;