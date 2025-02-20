'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { HiOutlineLightBulb } from 'react-icons/hi'
import { AlertCircle } from 'lucide-react'
import ReportModal from './ReportModal'

const Report = ({ className = '' }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    return (
        <>
            <div className={`bg-[rgba(255,255,255,0.02)] border-b border-white/5 ${className}`}>
                <div className="container mx-auto px-4 py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5">
                            <HiOutlineLightBulb className="w-5 h-5 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] text-white/80 leading-relaxed">
                                Сайт находится в бета-версии. Если вы нашли баг, пожалуйста, сообщите нам об этом.
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full sm:w-auto h-[50px] px-6 rounded-xl border border-white/5 
                                 hover:bg-white/[0.04] text-white/60 hover:text-white transition-all gap-2"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <AlertCircle className="w-4 h-4" />
                        <span>Сообщить о проблеме</span>
                    </Button>
                </div>
            </div>

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

export default Report