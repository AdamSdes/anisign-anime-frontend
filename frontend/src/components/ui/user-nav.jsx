import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useGetUserAvatarQuery } from '@/features/auth/authApiSlice'

export function UserNav({ onLogout }) {
  const { data: avatarUrl, isLoading: isAvatarLoading } = useGetUserAvatarQuery(undefined, {
    refetchOnMountOrArgChange: true
  })
  const router = useRouter()

  React.useEffect(() => {
    return () => {
      avatarUrl && avatarUrl.startsWith('blob:') && URL.revokeObjectURL(avatarUrl)
    }
  }, [avatarUrl])

  const handleLogout = () => {
    onLogout?.()
    router.push('/auth')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-[50px] pl-1 px-2 rounded-full border border-white/5 flex items-center justify-between gap-3 pr-4 transition-colors hover:bg-accent"
        >
          {isAvatarLoading ? (
            <div className="h-9 w-9 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={avatarUrl || "/avatar_logo.png"} alt="User Avatar" className="object-cover" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <p>adamsss</p>
              {/* <ChevronDown className="h-4 w-4 text-muted-foreground" /> */}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="end" forceMount sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Пользователь</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => router.push('/profile')} 
          className="cursor-pointer flex items-center gap-2 p-2 text-sm"
        >
          <User className="h-4 w-4" />
          <span>Профиль</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => router.push('/profile')} 
          className="cursor-pointer flex items-center gap-2 p-2 text-sm"
        >
          <Settings className="h-4 w-4" />
          <span>Настройки</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer flex items-center gap-2 p-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-100/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
