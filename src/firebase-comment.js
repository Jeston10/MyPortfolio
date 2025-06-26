import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCQFA7iQW3y4TX0dU29AF3sPiwejt5Kb8s",
    authDomain: "jeston-s-portfolio.firebaseapp.com",
    projectId: "jeston-s-portfolio",
    storageBucket: "jeston-s-portfolio.firebasestorage.app",
    messagingSenderId: "598101497023",
    appId: "1:598101497023:web:91f83690e8a70a9abfa20a",
    measurementId: "G-PEQQN557XZ"
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };