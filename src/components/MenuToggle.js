import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig'; 
import Inbox from './Inbox';
import { collection, query, where, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';

const MenuToggle = ({userId}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [unseenPings, setUnseenPings] = useState(0);
    const menuRef = useRef(null);


    
    useEffect(() => {
      // Listen for unseen pings
      const pingsQuery = query(
        collection(db, 'pings'),
        where('recipientId', '==', userId),
        where('seen', '==', false)
      );
  
      const unsubscribe = onSnapshot(pingsQuery, (snapshot) => {
        setUnseenPings(snapshot.size);
      });
  
      return () => unsubscribe();
    }, [userId]);
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
      if (!isOpen) {
        markPingsAsSeen();
      }
    };

    const markPingsAsSeen = async () => {
      try {
        const pingsQuery = query(
          collection(db, 'pings'),
          where('recipientId', '==', userId),
          where('seen', '==', false)
        );
  
        const snapshot = await getDocs(pingsQuery);
  
        if (!snapshot.empty) {
          const batch = writeBatch(db);
  
          snapshot.forEach((doc) => {
            batch.update(doc.ref, { seen: true });
          });
  
          await batch.commit();
        }
      } catch (error) {
        console.error('Error marking pings as seen:', error);
      }
    };
  
    // Close menu if clicked outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
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

    const handleLogout = async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error("Error during sign out", error);
        }
      };
  
    return (
        <div>
        <button
          className={`menu-button ${isOpen ? 'menu-button-open' : ''}`}
          onClick={toggleMenu}
        >
          ☰
          {unseenPings > 0 && (
          <div className="notification-dot">{unseenPings}</div>
        )}
        </button>
        <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={toggleMenu}></div>
        <nav ref={menuRef} className={`menu ${isOpen ? 'open' : ''}`}>
          <ul>
            <li>  <Inbox userId={userId} /></li>
            <li onClick={handleLogout}><a href="#">Kijelentkezés</a></li>
          </ul>
        </nav>
      </div>
    );
  };

export default MenuToggle;