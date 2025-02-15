"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Image as ImageIcon, AlertCircle, Crop, MoveIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void;
    title: string;
    acceptedFileTypes?: string[];
    maxFiles?: number;
    maxSize?: number;
    aspectRatio?: number;
}

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
    isOpen,
    onClose,
    onUpload,
    title,
    acceptedFileTypes = ['image/*'],
    maxFiles = 1,
    maxSize = 5 * 1024 * 1024,
    aspectRatio
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [cropArea, setCropArea] = useState<CropArea | null>(null);
    const [isDraggingCrop, setIsDraggingCrop] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const cropStartPos = useRef<{ x: number; y: number } | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setSelectedFile(file);
            toast.success('Файл успешно загружен');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif']
        },
        maxFiles,
        maxSize,
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
        disabled: isCropping,
        onDropRejected: (fileRejections) => {
            fileRejections.forEach((rejection) => {
                rejection.errors.forEach((error) => {
                    if (error.code === 'file-too-large') {
                        toast.error(`Файл слишком большой. Максимальный размер: ${maxSize / (1024 * 1024)}MB`, {
                            icon: <AlertCircle className="w-5 h-5 text-red-500" />
                        });
                    } else if (error.code === 'file-invalid-type') {
                        toast.error('Поддерживаются только форматы JPG, PNG и GIF', {
                            icon: <AlertCircle className="w-5 h-5 text-red-500" />
                        });
                    }
                });
            });
        }
    });

    const handleClose = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
        setSelectedFile(null);
        setIsCropping(false);
        setCropArea(null);
        setIsDraggingCrop(false);
        onClose();
    };

    const startCropping = () => {
        setIsCropping(true);
        if (imageRef.current) {
            const containerRect = imageRef.current.parentElement?.getBoundingClientRect();
            if (!containerRect) return;

            const imgWidth = imageRef.current.naturalWidth;
            const imgHeight = imageRef.current.naturalHeight;
            
            // Вычисляем масштаб изображения относительно контейнера
            const scale = Math.min(
                containerRect.width / imgWidth,
                containerRect.height / imgHeight
            );

            // Вычисляем размеры отображаемого изображения
            const displayWidth = imgWidth * scale;
            const displayHeight = imgHeight * scale;

            // Размер области кадрирования (меньшая сторона изображения * 0.8)
            const cropSize = Math.min(displayWidth, displayHeight) * 0.8;

            // Центрируем область кадрирования
            const x = (displayWidth - cropSize) / 2;
            const y = (displayHeight - cropSize) / 2;

            setCropArea({
                x,
                y,
                width: cropSize,
                height: cropSize
            });
        }
    };

    const handleCrop = async () => {
        if (!cropArea || !imageRef.current || !selectedFile) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Создаем временный canvas для масштабирования
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Получаем реальные размеры изображения и области отображения
        const imgNaturalWidth = imageRef.current.naturalWidth;
        const imgNaturalHeight = imageRef.current.naturalHeight;
        const displayRect = imageRef.current.getBoundingClientRect();

        // Вычисляем коэффициенты масштабирования
        const scaleX = imgNaturalWidth / displayRect.width;
        const scaleY = imgNaturalHeight / displayRect.height;

        // Вычисляем реальные координаты и размеры области кадрирования
        const realX = cropArea.x * scaleX;
        const realY = cropArea.y * scaleY;
        const realSize = cropArea.width * scaleX; // Используем width, так как область квадратная

        // Размер финального изображения (делаем чуть больше для лучшего качества)
        const finalSize = 512;

        // Настраиваем размеры canvas
        tempCanvas.width = finalSize;
        tempCanvas.height = finalSize;
        canvas.width = finalSize;
        canvas.height = finalSize;

        // Очищаем canvas
        tempCtx.clearRect(0, 0, finalSize, finalSize);
        ctx.clearRect(0, 0, finalSize, finalSize);

        // Включаем сглаживание
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Сначала рисуем квадратное изображение на временном canvas
        tempCtx.drawImage(
            imageRef.current,
            realX,
            realY,
            realSize,
            realSize,
            0,
            0,
            finalSize,
            finalSize
        );

        // Создаем круглую маску на основном canvas
        ctx.beginPath();
        ctx.arc(finalSize / 2, finalSize / 2, finalSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Рисуем квадратное изображение через круглую маску
        ctx.drawImage(tempCanvas, 0, 0);

        // Добавляем тонкую белую обводку
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const croppedFile = new File([blob], selectedFile.name, {
                type: 'image/png',
                lastModified: Date.now(),
            });

            onUpload([croppedFile]);
            handleClose();
        }, 'image/png', 1.0); // Максимальное качество
    };

    const handleUpload = () => {
        if (selectedFile) {
            if (isCropping) {
                handleCrop();
            } else {
                onUpload([selectedFile]);
                handleClose();
            }
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        setSelectedFile(null);
        setIsCropping(false);
        setCropArea(null);
        setIsDraggingCrop(false);
    };

    const handleCropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isCropping || !cropArea || !imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        setIsDraggingCrop(true);

        // Сохраняем смещение курсора относительно начала области кадрирования
        cropStartPos.current = {
            x: e.clientX - rect.left - cropArea.x,
            y: e.clientY - rect.top - cropArea.y
        };
    };

    const handleCropMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggingCrop || !cropArea || !imageRef.current || !cropStartPos.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        // Вычисляем новые координаты с учетом смещения от точки захвата
        let newX = e.clientX - rect.left - cropStartPos.current.x;
        let newY = e.clientY - rect.top - cropStartPos.current.y;

        // Ограничиваем перемещение границами изображения
        newX = Math.max(0, Math.min(newX, containerWidth - cropArea.width));
        newY = Math.max(0, Math.min(newY, containerHeight - cropArea.height));

        setCropArea(prev => {
            if (!prev) return null;
            return {
                ...prev,
                x: newX,
                y: newY
            };
        });
    };

    const handleCropMouseUp = () => {
        setIsDraggingCrop(false);
        cropStartPos.current = null;
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#060606]/95 backdrop-blur-xl border-white/5 p-6 max-w-md w-full">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl font-semibold text-white/90">{title}</DialogTitle>
                    <DialogDescription className="text-white/60">
                        {isCropping ? 'Выделите область для кадрирования' : 'Загрузите изображение в формате JPG, PNG или GIF'}
                    </DialogDescription>
                </DialogHeader>

                <div 
                    {...(!isCropping ? getRootProps() : {})}
                    className={`
                        mt-6 border-2 border-dashed rounded-xl relative
                        ${isDragging ? 'border-[#CCBAE4] bg-[#CCBAE4]/5' : 'border-white/10'}
                        transition-all duration-200
                        ${isCropping ? '' : 'cursor-pointer hover:border-[#CCBAE4]/70 hover:bg-[#CCBAE4]/5'}
                    `}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={handleCropMouseUp}
                >
                    {!isCropping && <input {...getInputProps()} />}
                    <AnimatePresence mode="wait">
                        {preview ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative p-4"
                            >
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                    <img 
                                        ref={imageRef}
                                        src={preview} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    {isCropping && cropArea && (
                                        <>
                                            {/* Затемнение вокруг области кадрирования */}
                                            <div className="absolute inset-0 bg-black/50">
                                                {/* Создаем круглое отверстие */}
                                                <div
                                                    className="absolute border-2 border-[#CCBAE4] rounded-full"
                                                    style={{
                                                        left: `${cropArea.x}px`,
                                                        top: `${cropArea.y}px`,
                                                        width: `${cropArea.width}px`,
                                                        height: `${cropArea.height}px`,
                                                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* Область кадрирования */}
                                            <div 
                                                className={`
                                                    absolute border-2 border-[#CCBAE4] rounded-full cursor-move
                                                    ${isDraggingCrop ? 'border-opacity-100' : 'border-opacity-70'}
                                                    transition-colors duration-200
                                                `}
                                                style={{
                                                    left: `${cropArea.x}px`,
                                                    top: `${cropArea.y}px`,
                                                    width: `${cropArea.width}px`,
                                                    height: `${cropArea.height}px`,
                                                }}
                                                onMouseDown={handleCropMouseDown}
                                            >
                                                {/* Индикатор перемещения */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <MoveIcon className="w-6 h-6 text-[#CCBAE4] opacity-50" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {!isCropping && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                                            <p className="text-white/90 text-sm font-medium">
                                                Нажмите или перетащите для замены
                                            </p>
                                            <p className="text-white/60 text-xs">{selectedFile?.name}</p>
                                        </div>
                                    )}
                                    {!isCropping && (
                                        <button
                                            onClick={removeFile}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-white/80" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 flex flex-col items-center gap-4"
                            >
                                <div className="p-4 rounded-full bg-white/5">
                                    <ImageIcon className="w-8 h-8 text-[#CCBAE4]" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-white/80 font-medium">
                                        Перетащите файл сюда или нажмите для выбора
                                    </p>
                                    <p className="text-white/40 text-sm">
                                        Максимальный размер: {maxSize / (1024 * 1024)}MB
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    {isCropping ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setIsCropping(false);
                                    setCropArea(null);
                                }}
                                className="text-white/60 hover:text-white/90 hover:bg-white/[0.08]"
                            >
                                Отменить кадрирование
                            </Button>
                            <Button
                                onClick={handleUpload}
                                className="bg-[#CCBAE4] text-[#060606] hover:bg-[#CCBAE4]/90"
                            >
                                Применить
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                onClick={handleClose}
                                className="text-white/60 hover:text-white/90 hover:bg-white/[0.08]"
                            >
                                Отмена
                            </Button>
                            {selectedFile && (
                                <Button
                                    onClick={startCropping}
                                    className="bg-white/[0.08] text-white/90 hover:bg-white/[0.12]"
                                >
                                    <Crop className="w-4 h-4 mr-2" />
                                    Кадрировать
                                </Button>
                            )}
                            <Button
                                disabled={!selectedFile}
                                onClick={handleUpload}
                                className={`
                                    ${selectedFile 
                                        ? 'bg-[#CCBAE4] text-[#060606] hover:bg-[#CCBAE4]/90' 
                                        : 'bg-white/[0.08] text-white/40'}
                                    transition-all duration-200
                                `}
                            >
                                Загрузить
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
