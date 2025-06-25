import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure correct path to your Firestore config
import { doc, getDoc } from 'firebase/firestore';

const PlayerMenu = ({ currentUserId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [players, setPlayers] = useState([]);
    const menuRef = useRef(null);
    const [userData, setUserData] = useState(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, 'stats', currentUserId);
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
      }, [currentUserId]);

    // Close menu if clicked outside
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const sendPing = async (recipientId, senderId, senderName) => {
        try {
            console.log(recipientId, senderId, senderName);
            await addDoc(collection(db, 'pings'), {
                recipientId,
                senderId,
                senderName,
                seen: false,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error('Error sending ping: ', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'stats'),
            (snapshot) => {
                const playerArray = [];

                snapshot.forEach((doc) => {
                    const userData = doc.data();

                    playerArray.push({ id: doc.id, name: userData.name });
                });


                // Sort players alphabetically by name
                playerArray.sort((a, b) => {
                    const nameA = a.name ? a.name.toString() : '';
                    const nameB = b.name ? b.name.toString() : '';
                    return nameA.localeCompare(nameB);
                });

                setPlayers(playerArray);
            },
            (error) => {
                console.error("Error listening to players update:", error);
            }
        );

        return () => unsubscribe();
    }, [currentUserId]);

    return (
        <div>
            <button className={`player-menu-button ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                Basszunk be
            </button>
            <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={toggleMenu}></div>
            <nav ref={menuRef} className={`player-menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    {players.map(player => (
                        <li key={player.id}>
                            {player.name}
                            <button className = 'ping-button' onClick={() => sendPing(player.id, currentUserId, userData.name)}>
                            <span className="emoji">🍻</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default PlayerMenu;