
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBMib6jnKel2eEscMvOHeoXPQpuVIh1go4",
  authDomain: "equisculptventure.firebaseapp.com",
  projectId: "equisculptventure",
  storageBucket: "equisculptventure.appspot.com",
  messagingSenderId: "1082422917955",
  appId: "1:1082422917955:web:e2a71b8377b130ef548df6"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }

