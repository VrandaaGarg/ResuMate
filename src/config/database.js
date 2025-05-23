import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();

export const createResume = async (resumeData) => {
  const user = auth.currentUser;
  if (!user) return;

  const resumeRef = doc(db, "users", user.uid, "resume", "data");
  const classicSettingsRef = doc(
    db,
    "users",
    user.uid,
    "classicSettings",
    "data"
  );
  const sidebarSettingsRef = doc(
    db,
    "users",
    user.uid,
    "sidebarSettings",
    "data"
  );
  const standardSettingRef = doc(
    db,
    "users",
    user.uid,
    "standardSettings",
    "data"
  );

  const defaultSettings = {};

  await setDoc(resumeRef, {
    gmail: user.email,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
    ...resumeData,
  });

  const [classicSnap, sidebarSnap, standardSnap] = await Promise.all([
    getDoc(classicSettingsRef),
    getDoc(sidebarSettingsRef),
    getDoc(standardSettingRef),
  ]);

  if (!classicSnap.exists()) {
    await setDoc(classicSettingsRef, {
      ...defaultSettings,
      createdOn: serverTimestamp(),
    });
  }

  if (!sidebarSnap.exists()) {
    await setDoc(sidebarSettingsRef, {
      ...defaultSettings,
      createdOn: serverTimestamp(),
    });
  }

  if (!standardSnap.exists()) {
    await setDoc(standardSettingRef, {
      ...defaultSettings,
      createdOn: serverTimestamp(),
    });
  }
};

export const updateResume = async (updatedFields) => {
  const user = auth.currentUser;
  if (!user) return;

  const resumeRef = doc(db, "users", user.uid, "resume", "data");
  await updateDoc(resumeRef, {
    ...updatedFields,
    updatedOn: serverTimestamp(),
  });
};

export const getResumeData = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const resumeRef = doc(db, "users", user.uid, "resume", "data");
  const snapshot = await getDoc(resumeRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const editClassicSettings = async (settings) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "classicSettings", "data");
  await setDoc(ref, { ...settings, updatedOn: serverTimestamp() });
};

export const getClassicSettings = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid, "classicSettings", "data");
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
};

export const editSidebarSettings = async (settings) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "sidebarSettings", "data");
  await setDoc(ref, { ...settings, updatedOn: serverTimestamp() });
};

export const getSidebarSettings = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid, "sidebarSettings", "data");
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
};

export const editStandardSettings = async (settings) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "standardSettings", "data");
  await setDoc(ref, { ...settings, updatedOn: serverTimestamp() });
};

export const getStandardSettings = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid, "standardSettings", "data");
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
};
