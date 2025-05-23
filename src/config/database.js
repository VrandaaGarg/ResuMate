import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Your firebase config file
import { getAuth } from "firebase/auth";

const auth = getAuth();

export const createResume = async (resumeData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const resumeRef = doc(db, "users", user.uid, "resume", "data");

  const defaultData = {
    gmail: user.email,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
    ...resumeData,
  };

  await setDoc(resumeRef, defaultData);
};

export const updateResume = async (updatedFields) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const resumeRef = doc(db, "users", user.uid, "resume", "data");

  await updateDoc(resumeRef, {
    ...updatedFields,
    updatedOn: serverTimestamp(),
  });
};

export const getResumeData = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const resumeRef = doc(db, "users", user.uid, "resume", "data");
  const snapshot = await getDoc(resumeRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
};
