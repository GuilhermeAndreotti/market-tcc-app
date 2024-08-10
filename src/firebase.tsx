import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlu7rGSEY8CuD76DxZx5FriyBYcfy8Kac",
  authDomain: "market-app-tcc.firebaseapp.com",
  projectId: "market-app-tcc",
  storageBucket: "market-app-tcc.appspot.com",
  messagingSenderId: "1046659648069",
  appId: "1:1046659648069:web:17bc5d1d4fef943fd9b12c"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);