'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // в байтах
  title?: string;
  description?: string;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  isOpen,
  onClose,
  onUpload,
  acceptedFileTypes = ['image/*'],
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB по умолчанию
  title = 'Загрузка файла',
  description = 'Перетащите файл сюда или нажмите для выбора',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFiles = (filesToValidate: File[]): File[] => {
    return filesToValidate.filter((file) => {
      // Проверка типа файла
      if (acceptedFileTypes.length > 0) {
        const fileType = file.type;
        const isValidType = acceptedFileTypes.some((type) => {
          if (type.endsWith('/*')) {
            const mainType = type.split('/')[0];
            return fileType.startsWith(`${mainType}/`);
          }
          return type === fileType;
        });

        if (!isValidType) {
          toast.error(`Файл "${file.name}" имеет неподдерживаемый формат`);
          return false;
        }
      }

      // Проверка размера файла
      if (file.size > maxSize) {
        const sizeMB = maxSize / (1024 * 1024);
        toast.error(`Файл "${file.name}" превышает максимальный размер ${sizeMB} МБ`);
        return false;
      }

      return true;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      if (droppedFiles.length > maxFiles) {
        toast.error(`Можно загрузить не более ${maxFiles} файлов`);
        return;
      }

      const validFiles = validateFiles(droppedFiles);
      setFiles(validFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      if (selectedFiles.length > maxFiles) {
        toast.error(`Можно загрузить не более ${maxFiles} файлов`);
        return;
      }

      const validFiles = validateFiles(selectedFiles);
      setFiles(validFiles);
    }
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error('Выберите файл для загрузки');
      return;
    }

    onUpload(files);
    setFiles([]);
    // Автоматически закрываем диалог после загрузки
    onClose();
  };

  const handleCancel = () => {
    setFiles([]);
    onClose();
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleClickUploadArea = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="bg-[#060606] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-white/60">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-white/40 bg-white/5'
              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUploadArea}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(',')}
            multiple={maxFiles > 1}
            className="hidden"
          />

          <Upload className="h-10 w-10 text-white/40 mb-2" />
          <p className="text-sm text-white/70 text-center">
            Перетащите файл сюда или нажмите для выбора
          </p>
          <p className="text-xs text-white/40 mt-1 text-center">
            {acceptedFileTypes.join(', ')} · Макс. {maxSize / (1024 * 1024)} МБ
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Выбранные файлы:</p>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/5 p-2 rounded-md"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-white/40">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0}>
            Загрузить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
