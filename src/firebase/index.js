import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx4uwJK8qerpT0bqPtT8Hz9uzA9cGJSBQ",
  authDomain: "naturalsource-e0d86.firebaseapp.com",
  projectId: "naturalsource-e0d86",
  storageBucket: "naturalsource-e0d86.appspot.com",
  messagingSenderId: "332518306710",
  appId: "1:332518306710:web:60d26e7716e5502a5b23b7",
  measurementId: "G-MQB3YKDMWF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);