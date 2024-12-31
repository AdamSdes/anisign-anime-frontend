import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function NotificationsNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-[50px] bg-white/5 w-[50px] rounded-full"
        >
          <img src="bell.svg" alt="notifications" className="h-[20px] w-[20px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[400px] p-2" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal px-2 py-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Уведомления</p>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
              Прочитать все
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          <DropdownMenuItem className="p-0 focus:bg-transparent hover:bg-transparent cursor-default">
            <div className="flex gap-3 p-3 w-full hover:bg-accent/50 transition-all duration-200 rounded-lg cursor-pointer group">
              <img 
                src="https://animego.me/upload/anime/images/67641f5785b6b666465610.jpg" 
                alt="Anime cover" 
                className="w-20 h-full rounded-[12px] object-cover shadow-sm group-hover:shadow-md transition-all"
              />
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                  Госпожа Кагуя: в любви как на войне
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  Добавлена 13-я серия с русской озвучкой
                </p>
                <Badge className="text-[11px] w-fit bg-white/5 hover:bg-white/5 text-muted-foreground whitespace-nowrap">9 часов назад</Badge>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 focus:bg-transparent hover:bg-transparent cursor-default">
            <div className="flex gap-3 p-3 w-full hover:bg-accent/50 transition-all duration-200 rounded-lg cursor-pointer group">
              <img 
                src="https://animego.me/upload/anime/images/668321821b7df482839372.jpg" 
                alt="Anime cover" 
                className="w-20 h-full rounded-[12px] object-cover shadow-sm group-hover:shadow-md transition-all"
              />
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                  Операция: Семейка Ёдзакура
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  Добавлена 10-я серия с русской озвучкой
                </p>
                <Badge className="text-[11px] w-fit bg-white/5 hover:bg-white/5 text-muted-foreground whitespace-nowrap">2 часа назад</Badge>
              </div>
            </div>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator className="my-1" />
        <Button 
          variant="ghost" 
          className="w-full justify-center text-sm text-muted-foreground hover:text-primary"
        >
          Показать все уведомления
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
