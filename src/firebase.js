import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  onValue, 
  update, 
  remove, 
  off 
} from "firebase/database";

// ✅ Firebase Configuration (Using Environment Variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ✅ Log environment variables for debugging (only in development)
if (import.meta.env.DEV) {
  console.log("Firebase Config:", firebaseConfig);
}

// ✅ Initialize Firebase App & Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Generate a Unique Poll ID
const generatePollId = () => `poll_${Date.now()}`;

// ✅ Export Firebase functions
export { 
  database, 
  ref, 
  set, 
  get, 
  onValue, 
  update, 
  remove, 
  off, 
  generatePollId 
};
