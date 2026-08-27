// import React from 'react';
// import { uploadFile } from '../api/client';

// /**
//  * PERSON 1: FRONTEND & UI DEVELOPER
//  * 
//  * TODOs for FileUploader.jsx:
//  * 1. Implement drag-and-drop for files (PDFs, Images, Excel, CSV).
//  * 2. Call the backend API (uploadFile) when a file is selected.
//  * 3. Show upload progress or success state.
//  */
// export default function FileUploader() {
//   const handleUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // Call backend to upload the file
//       // await uploadFile(file);
//     }
//   };

//   return (
//     <div className="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center">
//       <p className="text-sm text-gray-400 mb-2">Drag and drop files here</p>
//       <input type="file" onChange={handleUpload} className="text-sm" />
//     </div>
//   );
// }


import { useCallback, useRef, useState } from "react";
import { Paperclip, FileText, X, UploadCloud } from "lucide-react";

// Compact "attach" control that expands into a drop zone on drag-over.
// Kept file-type agnostic on purpose — the problem statement wants
// scanned PDFs, images, and drawings all accepted, and Person 5's
// OCR/vision pipeline decides what to do with each on the backend.
//
// TODO (Person 2): wire onFileSelected to POST /api/upload
// (multipart/form-data) and pass back the resulting { fileId, name,
// type } instead of the raw browser File object.
export default function FileUploader({ file, onFileSelected, onClear }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      if (files?.[0]) onFileSelected(files[0]);
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {!file && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs text-text-secondary transition ${
            dragOver
              ? "border-wire bg-wire/10 text-wire"
              : "border-base-border hover:border-text-tertiary hover:text-text-primary"
          }`}
          title="Attach a scanned PDF, image, or drawing"
        >
          {dragOver ? <UploadCloud size={14} /> : <Paperclip size={14} />}
          <span className="hidden sm:inline">Attach file</span>
        </button>
      )}

      {file && (
        <div className="flex items-center gap-2 rounded-md border border-wire/40 bg-wire/10 px-2.5 py-1.5 text-xs text-text-primary">
          <FileText size={14} className="shrink-0 text-wire" />
          <span className="max-w-[10rem] truncate">{file.name}</span>
          <button
            type="button"
            onClick={onClear}
            className="text-text-tertiary transition hover:text-alert"
            aria-label="Remove attachment"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.tiff,.docx,.xlsx,.csv"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
