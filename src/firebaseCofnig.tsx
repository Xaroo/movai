import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCswZaTNO5Mc1BOvEmCEKAMrOKbOoU8CuU",
  authDomain: "https://movai-b7f80.firebaseapp.com",
  databaseURL:
    "https://movai-b7f80-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movai-b7f80",
  storageBucket: "movai-b7f80.appspot.com",
  messagingSenderId: "681975861990",
  appId: "1:681975861990:android:b3cd1aa7e9df376c74a127",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database };
