import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyC5GPT8W32RQXcpy_dLXM7K1cpCvPISEY4",
	authDomain: "cyan-pink.firebaseapp.com",
	projectId: "cyan-pink",
	storageBucket: "cyan-pink.appspot.com",
	messagingSenderId: "612760891208",
	appId: "1:612760891208:web:fa977503cb26c8df074d7d",
	measurementId: "G-6FXRTHXG1C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);

export default db;

export const auth = getAuth();
