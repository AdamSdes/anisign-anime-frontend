'use client'
import React, { useState } from 'react';
import { Image, Modal, ModalContent, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import animeData from '/animeData.json';  // Укажите правильный путь до JSON-файла

const ImageModal = ({ src, isOpen, onOpenChange }) => (
    <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
            backdrop: "bg-opacity-50 backdrop-filter backdrop-blur-lg",
        }}
    >
        <ModalContent className="bg-transparent shadow-none">
            <ModalBody className="p-0">
                <Image
                    src={src}
                    alt="Zoomed Image"
                    className="rounded-md"
                />
            </ModalBody>
        </ModalContent>
    </Modal>
);

const ImageButton = ({ src, onPress }) => (
    <Button className="w-[315px] h-[187px] p-0" onPress={() => onPress(src)}>
        <Image
            isZoomed
            width={315}
            height={187}
            alt="NextUI Fruit Image with Zoom"
            src={src}
            className="rounded-md"
        />
    </Button>
);

export default function ImageGallery() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState(null);
    const { galleryImages } = animeData.animeDetails;

    const handleImageClick = (src) => {
        setSelectedImage(src);
        onOpen();
    };

    return (
        <div className="container mx-auto max-w-[1400px] px-2 py-10">
            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-[20px] font-semibold">Кадры / Трейлер</p>
                </div>
                <div className="flex justify-between gap-5">
                    {galleryImages.map((src, index) => (
                        <React.Fragment key={index}>
                            <ImageButton src={src} onPress={handleImageClick} />
                        </React.Fragment>
                    ))}
                    {selectedImage && (
                        <ImageModal src={selectedImage} isOpen={isOpen} onOpenChange={onOpenChange} />
                    )}
                </div>
            </div>
        </div>
    );
}
