import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure correct path to your Firestore config

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
  
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'stats'), (snapshot) => {
        const leaderboard = [];
        
        snapshot.forEach((doc) => {
          const userData = doc.data();
          const totalCounter = Object.values(userData.items || {}).reduce(
            (sum, count) => sum + count,
            0
          );
          leaderboard.push({ name: userData.name, totalCounter });
        });
  
        leaderboard.sort((a, b) => b.totalCounter - a.totalCounter);
        setLeaderboardData(leaderboard);
      }, (error) => {
        console.error("Error listening to leaderboard updates:", error);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <ul>
          {leaderboardData.map((user, index) => (
            <li key={index}>
              {index + 1}. {user.name} - Total: {user.totalCounter}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Leaderboard;