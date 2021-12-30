import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBSIo5MEKMh2wbIk28dYPBuI5VxPF-ye5A",
    authDomain: "signal-e526e.firebaseapp.com",
    projectId: "signal-e526e",
    storageBucket: "signal-e526e.appspot.com",
    messagingSenderId: "739071034275",
    appId: "1:739071034275:web:1ba439ec22356b3f621016"
  };
let app;

if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}else{
    app = firebase.app();
}

const firestoreInstance = firebase.firestore;
const db = app.firestore();
const auth = firebase.auth();

export { db, auth, firestoreInstance };