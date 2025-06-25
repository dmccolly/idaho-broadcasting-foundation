import React, { useState, useRef } from 'react';

const VoxProManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Programmatically open the hidden file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  // Clear the selected file
  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit the file to your API endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      // Handle success (e.g., show a toast or update UI)
      clearFile();
    } catch (error) {
      console.error('Upload error:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div className="voxpro-management">
      <h2>Upload VoxPro File</h2>

      {/* Clickable area that triggers the hidden file input */}
      <div
        className="upload-area"
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') triggerFileInput();
        }}
      >
        {selectedFile ? selectedFile.name : 'Click or drag a file here'}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style=https://operator.chatgpt.com/c/685c74230d148192b8d4a284ce1a6657#cua_citation-%20display:%20'none'%20
        accept=".wav,.mp3"
      />

      {/* Clear button appears only when a file is selected */}
      {selectedFile && (
        <button type="button" onClick={clearFile} className="clear-btn">
          Clear
        </button>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedFile}
        className="submit-btn"
      >
        Upload
      </button>
    </div>
  );
};

export default VoxProManagement;
