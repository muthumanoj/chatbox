import firebase from "firebase/app";

import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJ0ViiOpW2DGzp5mHHWZf7FAYsE7EfQis",
  authDomain: "chat-app-43ca1.firebaseapp.com",
  databaseURL: "https://chat-app-43ca1.firebaseio.com",
  projectId: "chat-app-43ca1",
  storageBucket: "chat-app-43ca1.appspot.com",
  messagingSenderId: "926440583724",
  appId: "1:926440583724:web:efd1a3fd8ba2a6e64d1789",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const storage = firebaseApp.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export { db, storage, timestamp };
