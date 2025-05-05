// backend/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const tareasRef = db.collection('tareas');

module.exports = { db, tareasRef };


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3DFX35ZVbt-0kNDIyVYo9F2ur03yB0Nk",
  authDomain: "grahpql.firebaseapp.com",
  databaseURL: "https://grahpql-default-rtdb.firebaseio.com",
  projectId: "grahpql",
  storageBucket: "grahpql.firebasestorage.app",
  messagingSenderId: "924960732525",
  appId: "1:924960732525:web:fa170f768ebdb418789664",
  measurementId: "G-6R1EVTY6MB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);