import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const Profile = ({ userId }) => {
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'stats', userId);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error("User data doesn't exist");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, [userId]);
  
    const updateCounter = async (itemId, increment) => {
      if (!userData) return;
  
      const newCount = (userData.items[itemId] || 0) + increment;
      if (newCount < 0) return;
  
      const userDocRef = doc(db, 'stats', userId);
      const updateditems = { ...userData.items, [itemId]: newCount };
  
      try {
        await updateDoc(userDocRef, { items: updateditems });
        setUserData((prevData) => ({
          ...prevData,
          items: updateditems,
        }));
      } catch (error) {
        console.error("Error updating counter:", error);
      }
    };
  
    if (!userData) {
      return <p>Loading...</p>;
    }
  
    return (
      <div>
        <h2>Welcome, {userData.name}</h2>
        <h3>Your Stats:</h3>
        <ul>
          {Object.entries(userData.items || {}).map(([itemId, count]) => (
            <li key={itemId} style={{ display: 'flex', alignItems: 'center' }}>
              <span>Your {itemId}: </span>
              <button onClick={() => updateCounter(itemId, -1)} style={{ margin: '0 5px' }}>-</button>
              <span>{count}</span>
              <button onClick={() => updateCounter(itemId, 1)} style={{ margin: '0 5px' }}>+</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default Profile;