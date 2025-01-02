"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function ChangePasswordDialog({ isOpen, onClose, onChangePassword, isLoading }) {
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const handleClose = () => {
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onChangePassword({
      password: oldPassword,
      newPassword,
      confirmPassword
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[425px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#060606] border border-white/5 rounded-[14px] shadow-xl"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translate(-50%, -50%)',
          WebkitFontSmoothing: 'subpixel-antialiased'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold text-white/90">Смена пароля</DialogTitle>
          <DialogDescription className="text-[14px] text-white/60">
            Введите текущий пароль и новый пароль для его изменения
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="old-password" className="text-[14px] text-white/90">
                Текущий пароль
              </Label>
              <Input
                id="old-password"
                type="password"
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-[rgba(255,255,255,0.02)] border border-white/5 text-white/80 h-[45px] rounded-[10px] focus:bg-[rgba(255,255,255,0.05)] transition-all duration-300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password" className="text-[14px] text-white/90">
                Новый пароль
              </Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[rgba(255,255,255,0.02)] border border-white/5 text-white/80 h-[45px] rounded-[10px] focus:bg-[rgba(255,255,255,0.05)] transition-all duration-300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-[14px] text-white/90">
                Подтверждение пароля
              </Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[rgba(255,255,255,0.02)] border border-white/5 text-white/80 h-[45px] rounded-[10px] focus:bg-[rgba(255,255,255,0.05)] transition-all duration-300"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleClose}
              className="h-[45px] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] text-white/60 hover:text-white border-white/5 rounded-[10px]"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-[45px] bg-[#CCBAE4] hover:opacity-90 text-black rounded-[10px]"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Изменить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
