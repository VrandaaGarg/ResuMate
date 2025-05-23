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

  //initialize classicSettings and sidebarSettings
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

  const defaultSettings = {}; // Optional: add defaults here if needed

  // Save resume
  await setDoc(resumeRef, {
    gmail: user.email,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
    ...resumeData,
  });

  // Initialize classicSettings if missing
  const classicSnap = await getDoc(classicSettingsRef);
  if (!classicSnap.exists()) {
    await setDoc(classicSettingsRef, {
      ...defaultSettings,
      createdOn: serverTimestamp(),
    });
  }

  // Initialize sidebarSettings if missing
  const sidebarSnap = await getDoc(sidebarSettingsRef);
  if (!sidebarSnap.exists()) {
    await setDoc(sidebarSettingsRef, {
      ...defaultSettings,
      createdOn: serverTimestamp(),
    });
  }

  // Initialize standardTemplate if missing
  const standardSnap = await getDoc(standardSettingRef);
  if (!standardSnap.exists()) {
    await setDoc(standardSettingRef, {
      ...defaultSettings,
      createdOn: serverTimestamp(),
    });
  }
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

export const editClassicSettings = async (settings) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const settingsRef = doc(db, "users", user.uid, "classicSettings", "data");

  await setDoc(settingsRef, {
    ...settings,
    updatedOn: serverTimestamp(),
  });
};

export const getClassicSettings = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const settingsRef = doc(db, "users", user.uid, "classicSettings", "data");
  const snapshot = await getDoc(settingsRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }
  return {};
};

export const editSidebarSettings = async (settings) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const settingsRef = doc(db, "users", user.uid, "sidebarSettings", "data");

  await setDoc(settingsRef, {
    ...settings,
    updatedOn: serverTimestamp(),
  });
};

export const getSidebarSettings = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const settingsRef = doc(db, "users", user.uid, "sidebarSettings", "data");
  const snapshot = await getDoc(settingsRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }
  return {};
};

export const editStandardSettings = async (settings) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const settingsRef = doc(db, "users", user.uid, "standardSettings", "data");

  await setDoc(settingsRef, {
    ...settings,
    updatedOn: serverTimestamp(),
  });
};

export const getStandardSettings = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const settingsRef = doc(db, "users", user.uid, "standardSettings", "data");
  const snapshot = await getDoc(settingsRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }
  return {};
};
