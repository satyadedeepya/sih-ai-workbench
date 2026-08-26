import React from 'react';
import { uploadFile } from '../api/client';

/**
 * PERSON 1: FRONTEND & UI DEVELOPER
 * 
 * TODOs for FileUploader.jsx:
 * 1. Implement drag-and-drop for files (PDFs, Images, Excel, CSV).
 * 2. Call the backend API (uploadFile) when a file is selected.
 * 3. Show upload progress or success state.
 */
export default function FileUploader() {
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Call backend to upload the file
      // await uploadFile(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-400 mb-2">Drag and drop files here</p>
      <input type="file" onChange={handleUpload} className="text-sm" />
    </div>
  );
}
