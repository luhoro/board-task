import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB79Rtg-Ju7Aog62jqhaDRBqRKJaXdz9Ek",
  authDomain: "board-plus-6ef0b.firebaseapp.com",
  projectId: "board-plus-6ef0b",
  storageBucket: "board-plus-6ef0b.appspot.com",
  messagingSenderId: "447506883841",
  appId: "1:447506883841:web:2c5f8de7361634c355e700"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }