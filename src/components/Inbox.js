import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const Inbox = ({ userId }) => {
    const [pings, setPings] = useState([]);

    useEffect(() => {
        if (!userId) return; // Ensure userId is defined

        const q = query(collection(db, 'pings'), where('recipientId', '==', userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pingArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPings(pingArray);
        });

        return () => unsubscribe();
    }, [userId]);

    const handleDelete = async (pingId) => {
        try {
            await deleteDoc(doc(db, 'pings', pingId));
            setPings((prevPings) => prevPings.filter(ping => ping.id !== pingId));
        } catch (error) {
            console.error('Error deleting ping:', error);
        }
    };

    return (
        <div className='inbox-container'>
            <div className="inbox">
                <h2>Meg kell inni</h2>
                <ul>
                    {pings.map((ping) => (
                        <li key={ping.id} className="ping-item">
                            <div className="ping-details">
                                <span className="ping-message">{ping.senderName}</span>
                                <div className='ping-details'>
                                    <span className="ping-message"> itatni akar!</span>
                                </div>
                            </div>
                            <div>
                                <span className="ping-time">{new Date(ping.timestamp.seconds * 1000).toLocaleString()}</span>
                            </div>
                            <button className="delete-button" onClick={() => handleDelete(ping.id)}>
                                <span role="img" aria-label="delete">🗑️</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Inbox;