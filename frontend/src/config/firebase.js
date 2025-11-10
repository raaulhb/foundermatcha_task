/**
 * Firebase configuration and initialization
 * This file sets up Firebase SDK to connect to local emulators
 *
 * For production deployment:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Replace firebaseConfig with your project credentials
 * 3. Remove emulator connection code
 * 4. Enable Authentication and Firestore in Firebase Console
 * 5. Deploy security rules from firestore.rules
 */

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration (for local emulator only)
// In production, these would come from environment variables
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "meeting-scheduler-demo",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators (only in development)
// This allows 100% local development without cloud resources
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { auth, db };
