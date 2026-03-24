// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBxxfsQGC87kXt6YyRJzchrBemUxDJ2I20",
  authDomain: "reining-hub-brasil.firebaseapp.com",
  projectId: "reining-hub-brasil",
  storageBucket: "reining-hub-brasil.firebasestorage.app",
  messagingSenderId: "708248020115",
  appId: "1:708248020115:web:82468b21a1161bab5c1966",
  measurementId: "G-4JNTLBVPP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);