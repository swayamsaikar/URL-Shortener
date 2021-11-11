import firebase from "firebase";
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC3Q7NK_GkZmj3F44m14QU4ceSnqZ8MOHo",
  authDomain: "url-shortner-ce6fc.firebaseapp.com",
  databaseURL: "https://url-shortner-ce6fc-default-rtdb.firebaseio.com",
  projectId: "url-shortner-ce6fc",
  storageBucket: "url-shortner-ce6fc.appspot.com",
  messagingSenderId: "702083194094",
  appId: "1:702083194094:web:15a6d17d494749b71d67ff",
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
