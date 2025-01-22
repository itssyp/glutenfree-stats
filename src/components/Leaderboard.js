import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure correct path to your Firestore config

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'stats'), 
      (snapshot) => {
        const leaderboard = [];
        
        // Define weights for each item
        const weights = {
          beer: 1.66,  // Example weight
          shot: 0.75,  // Example weight
          slug: 1.25,
          vine: 1
        };

        snapshot.forEach((doc) => {
          const userData = doc.data();

          // Calculate total counter with weights
          const totalCounter = Object.entries(userData.itemCounters || {}).reduce(
            (sum, [item, count]) => sum + (count * (weights[item] || 1)), 
            0
          );

          leaderboard.push({ name: userData.name, totalCounter });
        });

        leaderboard.sort((a, b) => b.totalCounter - a.totalCounter);
        setLeaderboardData(leaderboard);
      }, 
      (error) => {
        console.error("Error listening to leaderboard updates:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const convertIndex = (index) => {
    const conversion = {
      1:'\u{1F947}',
      2:'\u{1F948}',
      3:'\u{1F949}'
    }
    return conversion[index] || index + '.';
  }

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboardData.map((user, index) => (
          <li key={index}>
            {convertIndex(index + 1)} {user.name} - Total: {parseFloat(user.totalCounter).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;