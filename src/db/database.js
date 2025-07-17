import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
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

// File upload management functions
export const saveUploadedFile = async (fileData) => {
  const user = auth.currentUser;
  if (!user) return;

  // Only store in user document uploadedResumes array (no subcollection)
  const userRef = doc(db, "users", user.uid);

  // Check if user document exists, if not create it
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    // Create user document with initial data
    await setDoc(userRef, {
      uploadedResumes: [
        {
          id: fileData.fileId,
          fileName: fileData.fileName,
          fileUrl: fileData.fileUrl,
          uploadedAt: new Date().toISOString(),
          fileSize: fileData.fileSize,
          fileType: fileData.fileType,
          userId: user.uid,
        },
      ],
      createdAt: serverTimestamp(),
    });
  } else {
    // Update existing user document
    await updateDoc(userRef, {
      uploadedResumes: arrayUnion({
        id: fileData.fileId,
        fileName: fileData.fileName,
        fileUrl: fileData.fileUrl,
        uploadedAt: new Date().toISOString(),
        fileSize: fileData.fileSize,
        fileType: fileData.fileType,
        userId: user.uid,
      }),
    });
  }
};

// These functions are no longer needed since we're using only the uploadedResumes array

// Get user's uploaded resumes from user document
export const getUserUploadedResumes = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.uploadedResumes || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting uploaded resumes:", error);
    return [];
  }
};

// Delete uploaded resume
export const deleteUploadedResume = async (resumeId) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    // Get current user data
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const uploadedResumes = userData.uploadedResumes || [];

      // Find and remove the resume
      const resumeToDelete = uploadedResumes.find(
        (resume) => resume.id === resumeId
      );
      if (resumeToDelete) {
        await updateDoc(userRef, {
          uploadedResumes: arrayRemove(resumeToDelete),
        });
      }
    }
  } catch (error) {
    console.error("Error deleting uploaded resume:", error);
    throw error;
  }
};
