// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Firestore for storing bio, location, etc.
import { getStorage } from 'firebase/storage'; // Firebase Storage for profile picture

const firebaseConfig = {
    apiKey: "AIzaSyAGcGNXw0XWKQvFSt1voqmsW53K9mSGaec",
    authDomain: "foodiebase-7a7a6.firebaseapp.com",
    projectId: "foodiebase-7a7a6",
    storageBucket: "foodiebase-7a7a6.appspot.com",
    messagingSenderId: "824839180995",
    appId: "1:824839180995:web:742db54b525364409b8876",
    measurementId: "G-MWC57X4JKP"
  };
  
  

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const db = getFirestore(app); 
  export const storage = getStorage(app); 

