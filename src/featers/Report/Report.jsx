'use client'
import React from 'react';
import {Button} from '@/shared/shadcn-ui/button';
import {AButton} from "@/shared/anisign-ui/Button";
import {Textarea} from "@nextui-org/input";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
const Report = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [backdrop, setBackdrop] = React.useState('opaque')

    const backdrops = ["blur"];

    const handleOpen = (backdrop) => {
        setBackdrop(backdrop)
        onOpen();
    }

  return (
    <div className="bg-[rgba(255,255,255,0.02)]">
        <div className="container mx-auto px-2 py-5 flex justify-between items-center">
            <p className="text-[14px] opacity-80">
                Сайт находится в бета-версии. Если вы нашли баг, пожалуйста, обратитесь в поддержку.
            </p>

            <div className="flex flex-wrap gap-3">
                {backdrops.map((b) => (
                    <AButton
                        key={b}
                        color="border"
                        size="md"
                        onPress={() => handleOpen(b)}
                        className="capitalize"
                    >
                        Репорт
                    </AButton>
                ))}
            </div>
            <Modal className="p-5" size="xl" backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
                <ModalContent className="border bg-[#060606]">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Сообщить об ошибке</ModalHeader>
                            <ModalBody>
                                <div className="w-full h-[1px] mb-5 bg-white/5"></div>
                                <p className="mb-5 text-white/70">
                                    Сайт сейчас находится в <span
                                    className="text-[#CCBAE4] font-semibold">бета-версии</span>.
                                    Если вы заметили ошибку или другое несоответствие, пожалуйста, сообщите нам, и мы
                                    постараемся это исправить.
                                </p>
                                <Textarea
                                    variant="bordered"
                                    placeholder="Опишите проблему более детально"
                                    disableAnimation
                                    disableAutosize
                                    classNames={{
                                        inputWrapper: "border-white/10 mb-5",
                                        base: "w-full text-white ",
                                        input: "resize-y text-white min-h-[40px] h-[150px] max-h-[200px]",
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <AButton className="w-full" color="white" onPress={onClose}>
                                    Отправить
                                </AButton>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    </div>
  );
}

export default Report;
