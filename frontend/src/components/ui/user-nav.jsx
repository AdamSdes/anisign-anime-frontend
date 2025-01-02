import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, ChevronDown, Sparkles, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useGetUserAvatarQuery, useLazyGetUserByUsernameQuery } from '@/features/auth/authApiSlice'
import { useSelector } from 'react-redux'

export function UserNav({ onLogout }) {
  const [getUserByUsername, { data: user, isLoading: isUserLoading }] = useLazyGetUserByUsernameQuery();
  const { data: avatarUrl, isLoading: isAvatarLoading } = useGetUserAvatarQuery(undefined, {
    refetchOnMountOrArgChange: true
  })
  const username = useSelector(state => state.auth.user);
  const router = useRouter()

  React.useEffect(() => {
    if (username) {
      getUserByUsername(username);
    }
  }, [username, getUserByUsername]);

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
              <p>{user?.username || username}</p>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[280px] rounded-[14px] border border-white/5 bg-[#060606]/95 backdrop-blur-xl p-4" 
        align="end" 
        forceMount 
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="text-[14px] font-semibold text-white/90">{user?.username || username}</p>
            <p className="text-[12px] text-white/60">
              {user?.email || 'Новичок'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-white/5" />
        <div className="space-y-1">
          <DropdownMenuItem 
            onClick={() => router.push('/profile')} 
            className="rounded-[10px] px-2 py-2.5 text-[14px] font-medium text-white/60 cursor-pointer hover:text-white hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 flex items-center gap-3"
          >
            <User className="h-4 w-4" />
            <span>Профиль</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => router.push('/achievements')} 
            className="rounded-[10px] px-2 py-2.5 text-[14px] font-medium text-white/60 cursor-pointer hover:text-white hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 flex items-center gap-3"
          >
            <Trophy className="h-4 w-4" />
            <span>Достижения</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => router.push('/settings')} 
            className="rounded-[10px] px-2 py-2.5 text-[14px] font-medium text-white/60 cursor-pointer hover:text-white hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 flex items-center gap-3"
          >
            <Settings className="h-4 w-4" />
            <span>Настройки</span>
          </DropdownMenuItem>
        </div>

        <div className="px-2 py-3">
          <button 
            onClick={() => router.push('/pro')}
            className="w-full h-[45px] bg-gradient-to-r from-[#F4BD76] via-[#f3cc80] to-[#F4BD76] text-black/90 font-semibold text-[14px] rounded-[10px] hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Получить PRO
          </button>
        </div>

        <DropdownMenuSeparator className="my-2 bg-white/5" />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="rounded-[10px] px-2 py-2.5 text-[14px] font-medium text-[#FF5C5C] cursor-pointer hover:bg-[#FF5C5C]/5 transition-all duration-300 flex items-center gap-3"
        >
          <LogOut className="h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
