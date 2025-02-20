import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
}

const PROBLEM_TYPES = [
    { id: 'video', label: 'Проблемы с видео' },
    { id: 'audio', label: 'Проблемы со звуком' },
    { id: 'subtitle', label: 'Проблемы с субтитрами' },
    { id: 'interface', label: 'Проблемы с интерфейсом' },
    { id: 'account', label: 'Проблемы с аккаунтом' },
    { id: 'other', label: 'Другое' },
] as const

const ReportModal = ({ isOpen, onClose }: ReportModalProps) => {
    const [message, setMessage] = React.useState('')
    const [contact, setContact] = React.useState('')
    const [problemType, setProblemType] = React.useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({ problemType, message, contact })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] p-0 bg-[#060606] border-white/5">
                <DialogHeader className="px-8 py-6 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-white/40" />
                            <DialogTitle className="text-lg font-medium">
                                Сообщить о проблеме
                            </DialogTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 rounded-full hover:bg-white/5"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4 text-white/40" />
                        </Button>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-2.5">
                        <label className="text-sm text-white/60">
                            Тип проблемы
                        </label>
                        <Select onValueChange={setProblemType}>
                            <SelectTrigger 
                                className="w-full h-[54px] bg-white/[0.02] border-white/5 
                                         hover:bg-white/[0.04] rounded-xl text-white/80
                                         focus:ring-0 focus:ring-offset-0 px-4"
                            >
                                <SelectValue placeholder="Выберите тип проблемы" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#060606] border-white/5 p-2">
                                {PROBLEM_TYPES.map((type) => (
                                    <SelectItem 
                                        key={type.id} 
                                        value={type.id}
                                        className="text-white/60 hover:text-white focus:text-white
                                                 hover:bg-white/[0.04] focus:bg-white/[0.04]
                                                 cursor-pointer py-3 px-4 rounded-xl transition-colors"
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-sm text-white/60">
                            Опишите проблему
                        </label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Подробно опишите найденную проблему или баг..."
                            className="min-h-[140px] bg-white/[0.02] border-white/5 
                                     focus-visible:ring-1 focus-visible:ring-[#CCBAE4]
                                     placeholder:text-white/20 px-4 py-3 resize-none"
                            required
                        />
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-sm text-white/60">
                            Контакт для обратной связи
                        </label>
                        <Input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Telegram, Discord или Email..."
                            className="h-[54px] bg-white/[0.02] border-white/5
                                     focus-visible:ring-1 focus-visible:ring-[#CCBAE4]
                                     placeholder:text-white/20 px-4"
                        />
                    </div>

                    <div className="pt-3">
                        <Button
                            type="submit"
                            className="w-full h-[54px] bg-[#CCBAE4] hover:bg-[#CCBAE4]/90 
                                     text-black font-medium rounded-xl"
                        >
                            Отправить
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReportModal
