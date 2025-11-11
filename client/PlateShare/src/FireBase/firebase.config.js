// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbS2wa4eGQVMIAfwVAbv56JnGJLeHea-M",
    authDomain: "plateshare-21.firebaseapp.com",
    projectId: "plateshare-21",
    storageBucket: "plateshare-21.firebasestorage.app",
    messagingSenderId: "296918603155",
    appId: "1:296918603155:web:e0e845aa96f2b381714466"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;