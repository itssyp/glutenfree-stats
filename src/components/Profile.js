import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const Profile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [message, setMessage] = useState('');
  const [shake, setShake] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [lastClickedItemId, setLastClickedItemId] = useState(null);

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

  useEffect(() => {
    let timeout;
    let resetMessageTimeout;

    if (clickCount > 1) {
      setShowMessage(true);
      timeout = setTimeout(() => setClickCount(0), 1000); // Reset clickCount if no click within 500ms
    }

    resetMessageTimeout = setTimeout(() => setShowMessage(false), 1000); // Hide message if no clicks within 500ms

    if (clickCount === 2) setMessage('Dupla!');
    else if (clickCount === 3) setMessage('Tripla!');
    else if (clickCount === 4) setMessage('Megállíthatatlan!');
    else if (clickCount === 5) setMessage('Beteg állat!');
    else if (clickCount >= 6) {
      setMessage('EGY ISTEN!');
      setShake(true);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(resetMessageTimeout);
      setShake(false);
    };
  }, [clickCount]);

  const updateCounter = async (itemId, increment) => {
    if (!userData) return;

    const newCount = (userData.itemCounters[itemId] || 0) + increment;
    if (newCount < 0) return;

    const userDocRef = doc(db, 'stats', userId);
    const updateditems = { ...userData.itemCounters, [itemId]: newCount };

    try {
      await updateDoc(userDocRef, { itemCounters: updateditems });
      setUserData((prevData) => ({
        ...prevData,
        itemCounters: updateditems,
      }));
      handleClick(itemId, increment > 0);
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };

  const handleClick = (itemId, isIncrement) => {
    if (isIncrement) {
      setClickCount((prevCount) => prevCount + 1);
      setLastClickedItemId(itemId);
    }
  };

  const itemAlias = (itemId) => {
    const alias = {
      beer: "Söci (5dl)",
      shot: "Shot (2cl)",
      slug: "Tömény (4cl)",
      vine: "Bor (1dl)"
    };
    return alias[itemId];
  };

  if (!userData) {
    return <p>Várjál...</p>;
  }

  const sortedItems = Object.entries(userData.itemCounters || {}).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div>
      <h2>{userData.name}</h2>
      <ul>
        {sortedItems.map(([itemId, count]) => (
          <li key={itemId}>
            <span className="item-label">{itemAlias(itemId)}: </span>
            <button className="circle-button" onClick={() => updateCounter(itemId, -1)} style={{ margin: '0 5px' }}>-</button>
            <span className="count">{count}</span>
            <button className="circle-button" onClick={() => updateCounter(itemId, 1)} style={{ margin: '0 5px', position: 'relative' }}>
              +
              {showMessage && lastClickedItemId === itemId && (
                <div className={`message ${clickCount >= 6 ? 'red' : ''} ${shake ? 'shake' : ''}`} style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)' }}>
                  {message}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;