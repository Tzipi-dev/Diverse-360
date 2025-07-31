import { initializeApp } from "firebase/app";
import { signInWithPopup } from 'firebase/auth';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyD7Rbg8TBtSyZruejiyUIK-JaF74oaitO8",
//   authDomain: "divers-360.firebaseapp.com",
//   projectId: "divers-360",
//   storageBucket: "divers-360.firebasestorage.app",
//   messagingSenderId: "165765816529",
//   appId: "1:165765816529:web:8fb51f7ca28c0ab3cba5f0",
//   measurementId: "G-MC4WKBQNQG"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCN7Y3tCJzgt2ujlf8Hr34jcU3R_g1iSLA",
  authDomain: "divers-360-628f2.firebaseapp.com",
  projectId: "divers-360-628f2",
  storageBucket: "divers-360-628f2.firebasestorage.app",
  messagingSenderId: "346817898027",
  appId: "1:346817898027:web:9ba889c66e20584c586c6e",
  measurementId: "G-P7DFJ1M6JW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export { auth, googleProvider, githubProvider };
