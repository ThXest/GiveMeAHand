import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBgbutiOc5TkPiNP_CXxG7Nfy4hZC5d7Hk",
    authDomain: "gdsc-7d43f.firebaseapp.com",
    projectId: "gdsc-7d43f",
    storageBucket: "gdsc-7d43f.appspot.com",
    messagingSenderId: "1077135456875",
    appId: "1:1077135456875:web:39a440e1e44bb0cf28cf2e",
    measurementId: "G-YR7B77R6YQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const firestore = getFirestore(app);
