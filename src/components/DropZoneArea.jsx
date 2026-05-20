import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

const DropZoneArea = ({ onDrop }) => {
  
  const onDropCallback = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`dropzone-container ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="dropzone-icon" />
      <h3 className="dropzone-title">
        {isDragActive ? "Drop your CSV here" : "Drag & Drop CSV"}
      </h3>
      <p className="dropzone-subtitle">or click to browse from your computer</p>
    </div>
  );
};

export default DropZoneArea;
