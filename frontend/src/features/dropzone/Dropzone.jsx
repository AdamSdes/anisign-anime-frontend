'use client'

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

const MyDropzone = ({ onDrop, children, className }) => {
  const handleDrop = useCallback((acceptedFiles) => {
    if (onDrop) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "relative cursor-pointer transition-all duration-200",
        isDragActive && "opacity-70",
        className
      )}
    >
      <input {...getInputProps()} />
      {children}
      {isDragActive && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">Отпустите файл</span>
        </div>
      )}
    </div>
  );
};

export default MyDropzone;
