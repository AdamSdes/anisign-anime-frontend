"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { CircularProgress } from "@nextui-org/react"

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
  const [isUploading, setIsUploading] = React.useState(false)

  const onDrop = React.useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  })

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      await onUpload([file])
      setFile(null)
      setIsUploading(false)
      onClose()
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setFile(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#18181B] border-white/5">
        <DialogHeader>
          <DialogTitle className="text-white">Загрузить аватар</DialogTitle>
          <DialogDescription className="text-white/60">
            Перетащите изображение или нажмите для выбора файла
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer 
            ${isDragActive ? "border-primary" : "border-white/5"} 
            hover:border-primary transition-colors
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-8 w-8 text-white/60" />
            <p className="text-sm text-white/60">
              {isDragActive
                ? "Отпустите файл здесь"
                : "Перетащите файл сюда или нажмите для выбора"}
            </p>
          </div>
        </div>

        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-white/60">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {isUploading ? (
              <div className="flex justify-center">
                <CircularProgress size="sm" color="primary" />
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="w-full bg-white text-black hover:bg-white/90 py-2 px-4 rounded-md transition-colors"
              >
                Загрузить
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
