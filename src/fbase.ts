// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

const db = getFirestore(app);
const sizesRef = collection(db, 'sizes');
const getSizeId = (row: number, col: number) => `${row}X${col}`;

export const addScore = async (
  username: string,
  score: number,
  row: number,
  col: number
) => {
  const userRef = doc(sizesRef, getSizeId(row, col), 'users', username);
  await setDoc(
    userRef,
    {
      scores: arrayUnion(score),
    },
    { merge: true }
  );
};
export interface ScoreInfo {
  username: string;
  score: number;
}
export const getScores = async (row: number, col: number) => {
  const usersRef = collection(sizesRef, getSizeId(row, col), 'users');
  const snapshot = await getDocs(usersRef);

  const result: ScoreInfo[] = [];
  snapshot.forEach((doc) => {
    const username = doc.id;
    const { scores } = doc.data();

    const score = scores.reduce((pv: number, cv: number) => {
      return Math.max(pv, cv);
    });

    result.push({ username, score });
  });

  result.sort(({ score: scoreA }, { score: scoreB }) => {
    return scoreB - scoreA;
  });

  return result;
};
