// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import {
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
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
const analytics = getAnalytics(app);
export const logAnalytics = (eventName: string, ...args: any[]) =>
  logEvent(analytics, eventName, ...args);

const db = getFirestore(app);
const sizesRef = collection(db, 'sizes');
const getSizeId = (row: number, col: number) => `${row}X${col}`;

export const addScore = async (
  username: string,
  score: number,
  row: number,
  col: number
) => {
  const sizeId = getSizeId(row, col);
  const userRef = doc(sizesRef, sizeId, 'users', username);
  await setDoc(
    userRef,
    {
      scores: arrayUnion(score),
      size: sizeId,
    },
    { merge: true }
  );
};
export interface ScoreInfo {
  username: string;
  score: number;
  size?: string;
}
const getScoreInfo = (doc: QueryDocumentSnapshot<DocumentData>) => {
  const username = doc.id;
  const { scores, size } = doc.data();

  const score = scores.reduce((pv: number, cv: number) => {
    return Math.max(pv, cv);
  });

  return { username, score, size };
};
const sortByScore = (scoreInfos: ScoreInfo[]) => {
  scoreInfos.sort(({ score: scoreA }, { score: scoreB }) => {
    return scoreB - scoreA;
  });
};
export const getScores = async (row: number, col: number) => {
  const usersRef = collection(sizesRef, getSizeId(row, col), 'users');
  const snapshot = await getDocs(usersRef);

  const result: ScoreInfo[] = [];
  snapshot.forEach((doc) => {
    result.push(getScoreInfo(doc));
  });

  sortByScore(result);

  return result;
};

export const getAllScores = async () => {
  const usersGroupsRef = collectionGroup(db, 'users');
  const snapshot = await getDocs(usersGroupsRef);

  const result: ScoreInfo[] = [];
  snapshot.forEach((doc) => {
    result.push(getScoreInfo(doc));
  });

  sortByScore(result);

  return result;
};
