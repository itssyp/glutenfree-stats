import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

// Your existing Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB767phx_vzvSirdCKOMMj2mtoRFBOfHLI",
    authDomain: "glutenfree-ski-stats.firebaseapp.com",
    projectId: "glutenfree-ski-stats",
    storageBucket: "glutenfree-ski-stats.firebasestorage.app",
    messagingSenderId: "670670314891",
    appId: "1:670670314891:web:f9a56fe54e11c7a9e4638e",
    measurementId: "G-Z3KN4S3FWR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { db, auth, messaging };
