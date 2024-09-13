// IMPORT THE FUNCTIONS YOU NEED FROM THE SDK'S YOU NEED
import { initializeApp } from "firebase/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore/lite";
import { FIREBASE_CONNECT_CONFIG } from "../config/constants/environments";


// INITIALIZE FIREBASE
const app = initializeApp(FIREBASE_CONNECT_CONFIG);
export const db = getFirestore(app);
