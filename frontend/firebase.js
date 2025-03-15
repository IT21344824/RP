import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD52q08I-cyb-feFVfU6LSpTNmNuxQ9KzU",
  authDomain: "rptest1-2e8f2.firebaseapp.com",
  projectId: "rptest1-2e8f2",
  storageBucket: "rptest1-2e8f2.appspot.com",
  messagingSenderId: "510339827641",
  appId: "1:510339827641:web:c15d9e1c9c95c3d6c31868",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
