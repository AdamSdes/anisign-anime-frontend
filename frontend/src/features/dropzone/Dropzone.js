import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const MyDropzone = ({
    onUpload = async () => {},
    onUploadSuccess = () => {},
    onUploadError = () => {},
    className = "",
    children,
}) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            try {
                const response = await onUpload(file);
                console.log("File uploaded successfully:", response);
                onUploadSuccess(response);
            } catch (error) {
                console.error("Error uploading file:", error);
                onUploadError(error);
            }
        }
    }, [onUpload, onUploadSuccess, onUploadError]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            className={`cursor-pointer flex items-center justify-center ${className}`}
        >
            <input {...getInputProps()} />
            {children}
        </div>
    );
};

export default MyDropzone;