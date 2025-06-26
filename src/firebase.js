import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore"; // Perbarui ini


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQFA7iQW3y4TX0dU29AF3sPiwejt5Kb8s",
  authDomain: "jeston-s-portfolio.firebaseapp.com",
  projectId: "jeston-s-portfolio",
  storageBucket: "jeston-s-portfolio.firebasestorage.app",
  messagingSenderId: "598101497023",
  appId: "1:598101497023:web:91f83690e8a70a9abfa20a",
  measurementId: "G-PEQQN557XZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };