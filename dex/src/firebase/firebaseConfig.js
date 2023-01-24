import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/database";
import Axios from "axios";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBEO7KGBqlINcTc7fNq-gyWlcXMGB2Th_s",
  authDomain: "longswap-prod.firebaseapp.com",
  projectId: "longswap-prod",
  storageBucket: "longswap-prod.appspot.com",
  messagingSenderId: "391572506143",
  appId: "1:391572506143:web:9689e6020657a7d19af72a",
  measurementId: "G-ZQNKDB2LRV",
};

firebase.initializeApp(config);

const db = firebase.firestore();

export { Axios, db };
