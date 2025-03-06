"use client";

import * as React from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "react-image-crop/dist/ReactCrop.css";
import { CropIcon, Trash2Icon } from "lucide-react";
import GIF from "gif.js";
import { ImageCropperProps } from "@/shared/types/image-cropper";

/**
 * Компонент для кадрирования изображений с поддержкой GIF
 * @param props Пропсы компонента
 */
export function ImageCropper({
  open,
  onOpenChange,
  selectedFile,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const aspect = 1;
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [preview, setPreview] = React.useState<string>("");
  const [isGif, setIsGif] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setIsGif(selectedFile.type === "image/gif");
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const onImageLoad = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (aspect) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
      }
    },
    [aspect]
  );

  const handleCropComplete = React.useCallback(
    async (crop: PixelCrop) => {
      if (!imgRef.current || !crop.width || !crop.height) return;

      if (isGif) {
        await handleGifCrop(crop);
      } else {
        const croppedBlob = await getCroppedImg(imgRef.current, crop);
        if (croppedBlob) {
          onCropComplete(croppedBlob);
          onOpenChange(false);
        }
      }
    },
    [isGif, onCropComplete, onOpenChange]
  );

  const handleGifCrop = React.useCallback(
    async (crop: PixelCrop) => {
      if (!selectedFile || !imgRef.current) return;
      setIsProcessing(true);

      try {
        const gif = new GIF({
          workers: 2,
          quality: 10,
          width: 400,
          height: 400,
          workerScript: "/gif.worker.js",
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");

        const outputSize = 400;
        canvas.width = outputSize;
        canvas.height = outputSize;

        const img = new Image();
        img.src = preview;
        await new Promise((resolve) => (img.onload = resolve));

        const scaleX = img.naturalWidth / imgRef.current.width;
        const scaleY = img.naturalHeight / imgRef.current.height;

        ctx.beginPath();
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          outputSize,
          outputSize
        );

        gif.addFrame(canvas, { delay: 100 });

        gif.on("finished", (blob: Blob) => {
          onCropComplete(blob);
          onOpenChange(false);
          setIsProcessing(false);
        });

        gif.render();
      } catch (error) {
        console.error("Error processing GIF:", error);
        const croppedBlob = await getCroppedImg(imgRef.current, crop);
        if (croppedBlob) {
          onCropComplete(croppedBlob);
          onOpenChange(false);
        }
        setIsProcessing(false);
      }
    },
    [selectedFile, preview, onCropComplete, onOpenChange]
  );

  const getCroppedImg = React.useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const outputSize = 400;
      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        outputSize,
        outputSize
      );

      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob),
          isGif ? "image/gif" : "image/png",
          1.0
        );
      });
    },
    [isGif]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#060606]/95 backdrop-blur-xl border-white/5 p-6 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white/90">
            Кадрирование изображения
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(_, completedCrop) => {
                if (imgRef.current) {
                  const pixelCrop: PixelCrop = {
                    x: (completedCrop.x / 100) * imgRef.current.width,
                    y: (completedCrop.y / 100) * imgRef.current.height,
                    width: (completedCrop.width / 100) * imgRef.current.width,
                    height: (completedCrop.height / 100) * imgRef.current.height,
                    unit: "px",
                  };
                  handleCropComplete(pixelCrop);
                }
              }}
            aspect={aspect}
            circularCrop
            className="w-full"
          >
            <img
              ref={imgRef}
              className="max-h-[400px] w-full object-contain rounded-lg"
              alt="Crop preview"
              src={preview}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <DialogFooter className="flex justify-end gap-3">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white/90 hover:bg-white/[0.08]"
            onClick={() => {
              onCancel();
              onOpenChange(false);
            }}
          >
            <Trash2Icon className="w-4 h-4 mr-2" />
            Отмена
          </Button>
          <Button
            className="bg-[#CCBAE4] text-[#060606] hover:bg-[#CCBAE4]/90"
            disabled={isProcessing || !crop}
            onClick={() => {
                if (crop && imgRef.current) {
                  const pixelCrop: PixelCrop = {
                    x: (crop.x / 100) * imgRef.current.width,
                    y: (crop.y / 100) * imgRef.current.height,
                    width: (crop.width / 100) * imgRef.current.width,
                    height: (crop.height / 100) * imgRef.current.height,
                    unit: "px",
                  };
                  handleCropComplete(pixelCrop);
                }
            }}          
          >
            <CropIcon className="w-4 h-4 mr-2" />
            {isProcessing ? "Обработка..." : "Применить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Вспомогательная функция для центрирования области кадрирования
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
        height: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}