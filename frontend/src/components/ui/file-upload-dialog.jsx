"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, AlertCircle } from "lucide-react"
import { CircularProgress } from "@nextui-org/react"
import { motion, AnimatePresence } from "framer-motion"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function FileUploadDialog({ isOpen, onClose, onUpload }) {
  const [file, setFile] = React.useState(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const onDrop = React.useCallback((acceptedFiles, rejectedFiles) => {
    setErrorMessage(""); // Сбрасываем ошибку при новой попытке

    if (rejectedFiles && rejectedFiles.length > 0) {
      const file = rejectedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setErrorMessage(`Файл слишком большой (${sizeMB}MB). Максимальный размер 5MB`);
        return;
      }
    }
    
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    
    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 500)

      await onUpload(file)
      
      clearInterval(interval)
      setUploadProgress(100)
      
      setTimeout(() => {
        handleClose()
      }, 500)
    } catch (error) {
      console.error('Upload failed:', error)
      setErrorMessage("Ошибка при загрузке файла")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    setErrorMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Загрузить аватар</DialogTitle>
          <DialogDescription>
            Перетащите изображение сюда или нажмите для выбора файла.
            Максимальный размер файла 5MB.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-3 flex items-center gap-2 text-sm text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
            isDragActive ? "border-primary" : "border-white/5",
            "hover:border-primary"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            {file ? (
              <>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-muted-foreground">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  PNG, JPG или GIF до 5MB
                </p>
              </>
            )}
          </div>
        </div>

        {file && !isUploading && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setFile(null)}
              className="flex items-center text-sm text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Удалить
            </button>
            <button
              onClick={handleUpload}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Загрузить
            </button>
          </div>
        )}

        {isUploading && (
          <div className="flex justify-center">
            <CircularProgress
              size="lg"
              value={uploadProgress}
              color="primary"
              showValueLabel={true}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
