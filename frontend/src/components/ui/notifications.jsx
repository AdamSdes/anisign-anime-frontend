import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function NotificationsNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-[50px] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] border border-white/5 w-[50px] rounded-full transition-all duration-300"
        >
          <Bell className="h-5 w-5 text-white/60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[480px] rounded-[14px] border border-white/5 bg-[#060606]/95 backdrop-blur-xl p-4" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-white/90">Уведомления</p>
            <Button 
              variant="ghost" 
              className="text-[12px] text-white/60 hover:text-white"
              size="sm"
            >
              Прочитать все
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-white/5" />
        
        {/* Запросы в друзья */}
        <div className="rounded-[10px] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300">
          <div className="flex gap-3 p-3">
            <img 
              src="/avatar_logo.png"
              alt="User avatar" 
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <div className="flex flex-col flex-1">
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-white/90">
                  Александр
                </p>
                <p className="text-[12px] text-white/60">
                  Хочет добавить вас в друзья
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-8 px-4 bg-[#CCBAE4]/10 hover:bg-[#CCBAE4]/20 text-[#CCBAE4] rounded-lg"
                  >
                    Принять
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-8 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"
                  >
                    Отклонить
                  </Button>
                </div>
              </div>
              <p className="text-[11px] text-white/40 mt-2">5 минут назад</p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-white/5" />
        
        {/* Существующие уведомления */}
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          <div className="rounded-[10px] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 cursor-pointer">
            <div className="flex gap-3 p-3">
              <img 
                src="https://animego.me/upload/anime/images/67641f5785b6b666465610.jpg" 
                alt="Anime cover" 
                className="w-[70px] h-[90px] rounded-[10px] object-cover"
              />
              <div className="flex flex-col flex-1 gap-2">
                <p className="text-[14px] font-medium text-white/90 line-clamp-2">
                  Госпожа Кагуя: в любви как на войне
                </p>
                <p className="text-[12px] text-white/60 line-clamp-2">
                  Добавлена 13-я серия с русской озвучкой
                </p>
                <p className="text-[11px] text-white/40">9 часов назад</p>
              </div>
            </div>
          </div>

          <div className="rounded-[10px] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 cursor-pointer">
            <div className="flex gap-3 p-3">
              <img 
                src="https://animego.me/upload/anime/images/668321821b7df482839372.jpg" 
                alt="Anime cover" 
                className="w-[70px] h-[90px] rounded-[10px] object-cover"
              />
              <div className="flex flex-col flex-1 gap-2">
                <p className="text-[14px] font-medium text-white/90 line-clamp-2">
                  Операция: Семейка Ёдзакура
                </p>
                <p className="text-[12px] text-white/60 line-clamp-2">
                  Добавлена 10-я серия с русской озвучкой
                </p>
                <p className="text-[11px] text-white/40">2 часа назад</p>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator className="my-2 bg-white/5" />
        <Button 
          variant="ghost" 
          className="w-full h-[45px] rounded-[10px] text-[14px] font-medium text-white/60 hover:text-white hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300"
        >
          Показать все уведомления
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
