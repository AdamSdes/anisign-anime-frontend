import { Crop } from "react-image-crop";

export interface ImageCropperProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedFile: File | null;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
}