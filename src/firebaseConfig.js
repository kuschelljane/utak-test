// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyzrTopNzkOdtEQElTFeV0tb9ma1d8Y2U",
  authDomain: "restaurantmenu-51355.firebaseapp.com",
  databaseURL: "https://restaurantmenu-51355-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restaurantmenu-51355",
  storageBucket: "restaurantmenu-51355.appspot.com",
  messagingSenderId: "543529889231",
  appId: "1:543529889231:web:ceb845669c81cbb91f76ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app; 