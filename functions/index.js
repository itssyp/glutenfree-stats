/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendPingNotification = functions.firestore
    .document("pings/{pingId}")
    .onCreate(async (snap, context) => {
      const pingData = snap.data();

      const message = {
        notification: {
          title: "New Ping!",
          body: `${pingData.senderName} has pinged you with 🍻!`,
        },
        token: pingData.recipientFcmToken, // The recipient's FCM token
      };

      try {
        await admin.messaging().send(message);
        console.log("Ping notification sent successfully");
      } catch (error) {
        console.error("Error sending ping notification:", error);
      }
    });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
