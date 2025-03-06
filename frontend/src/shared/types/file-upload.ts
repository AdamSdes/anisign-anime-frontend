export interface FileUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void;
    title: string;
    acceptedFileTypes?: string[];
    maxFiles?: number;
    maxSize?: number;
    aspectRatio?: number;
}

export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}