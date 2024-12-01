import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadAvatarMutation } from "@/features/auth/authApiSlice";

const MyDropzone = ({
    onUploadSuccess = () => {},
    onUploadError = () => {},
    className = "",
    children,
}) => {
    const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            try {
                const response = await uploadAvatar(file).unwrap();
                console.log("Avatar uploaded successfully:", response);
                onUploadSuccess(response);
            } catch (error) {
                console.error("Error uploading avatar:", error);
                onUploadError(error);
            }
        }
    }, [uploadAvatar, onUploadSuccess, onUploadError]);

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