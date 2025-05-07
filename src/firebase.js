import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  confirmPasswordReset,
 
  signOut
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
//https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW9HDqKQJBFZHTZb-yrMQrTfOTCRVwYR4",
  authDomain: "agrovisionai-6f9e4.firebaseapp.com",
  projectId: "agrovisionai-6f9e4",
  storageBucket: "agrovisionai-6f9e4.firebasestorage.app",
  messagingSenderId: "244097376000",
  appId: "1:244097376000:web:9403e863a1d2cf04b85de5",
  measurementId: "G-YLM6P721NL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut
};

