// src/services/fileStorage.js
import { storage, ID } from '../appwrite.js';
import { auth } from '../firebase.js';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

/**
 * Upload a file to Appwrite storage
 * @param {File} file - The file to upload
 * @param {string} fileName - Custom filename (optional)
 * @returns {Promise<Object>} Upload result with file ID and URL
 */
export const uploadFile = async (file, fileName = null) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate unique filename with user ID prefix
    const fileId = fileName || `${user.uid}_${Date.now()}_${file.name}`;
    
    // Upload file to Appwrite bucket
    const result = await storage.createFile(BUCKET_ID, ID.unique(), file);
    
    // Get file URL
    const fileUrl = getFileUrl(result.$id);
    
    return {
      fileId: result.$id,
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      userId: user.uid
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Get file URL from Appwrite storage
 * @param {string} fileId - The file ID
 * @returns {string} File URL
 */
export const getFileUrl = (fileId) => {
  try {
    return storage.getFileView(BUCKET_ID, fileId);
  } catch (error) {
    console.error('Get file URL error:', error);
    throw new Error(`Failed to get file URL: ${error.message}`);
  }
};

/**
 * Delete a file from Appwrite storage
 * @param {string} fileId - The file ID to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileId) => {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Get file metadata from Appwrite storage
 * @param {string} fileId - The file ID
 * @returns {Promise<Object>} File metadata
 */
export const getFileMetadata = async (fileId) => {
  try {
    return await storage.getFile(BUCKET_ID, fileId);
  } catch (error) {
    console.error('Get file metadata error:', error);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

/**
 * Validate file type and size for resume uploads
 * @param {File} file - The file to validate
 * @returns {Object} Validation result
 */
export const validateResumeFile = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  const errors = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported. Please upload PDF, DOC, DOCX, or TXT files.');
  }
  
  if (file.size > maxSize) {
    errors.push('File size too large. Please upload files smaller than 10MB.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
