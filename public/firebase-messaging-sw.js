importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB767phx_vzvSirdCKOMMj2mtoRFBOfHLI",
  authDomain: "glutenfree-ski-stats.firebaseapp.com",
  projectId: "glutenfree-ski-stats",
  storageBucket: "glutenfree-ski-stats.firebasestorage.app",
  messagingSenderId: "670670314891",
  appId: "1:670670314891:web:f9a56fe54e11c7a9e4638e",
  measurementId: "G-Z3KN4S3FWR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
