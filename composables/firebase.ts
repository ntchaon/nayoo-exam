import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const createFirebase = () => {
  const config = useRuntimeConfig().public;
  const firebaseApp = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: config.FIREBASE_API_KEY,
        authDomain: config.FIREBASE_AUTH_DOMAIN,
        projectId: config.FIREBASE_PROJECT_ID,
        storageBucket: config.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
        appId: config.FIREBASE_APP_ID,
      });

  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  return { firebaseApp, firestore, storage };
};
