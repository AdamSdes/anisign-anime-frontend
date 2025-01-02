import { UserPlus, Users, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Friends = () => {
  const friends = [
    { id: 1, name: 'ADAMSSSS', status: 'online', avatar: '/avatar_logo.png', watching: 'Магическая битва 2' },
    { id: 2, name: 'Yuki', status: 'offline', avatar: '/avatar_logo.png', watching: null },
    { id: 3, name: 'Макс', status: 'online', avatar: '/avatar_logo.png', watching: 'Госпожа Кагуя' },
    { id: 4, name: 'Макс', status: 'online', avatar: '/avatar_logo.png', watching: 'Госпожа Кагуя' },
    // ...existing friends data
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] lg:text-[20px] font-bold">Друзья</h2>
          <span className="px-2.5 py-1 text-[12px] bg-[rgba(255,255,255,0.02)] text-white/60 rounded-full">
            {friends.length}
          </span>
        </div>
        
        <Button
          variant="ghost"
          className="h-[45px] px-4 rounded-full flex items-center gap-2 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-white/60 hover:text-white transition-all duration-300"
        >
          <UserPlus className="h-4 w-4" />
          <span className="text-[14px]">Добавить</span>
        </Button>
      </div>

      {/* Сетка друзей */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <div 
            key={friend.id}
            className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[14px] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 cursor-pointer group"
          >
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-transparent group-hover:border-white/10 transition-all duration-300">
                  <AvatarImage 
                    src={friend.avatar} 
                    alt={friend.name}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <UserCircle className="w-8 h-8 text-white/40" />
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-[3px] border-[#060606] ${
                  friend.status === 'online' 
                    ? 'bg-green-400' 
                    : 'bg-white/20'
                }`} />
              </div>
              
              <div className="mt-3 text-center w-full">
                <p className="font-medium text-[14px] text-white/90 group-hover:text-white transition-colors duration-300 truncate">
                  {friend.name}
                </p>
                {friend.watching && (
                  <p className="mt-1 text-[12px] text-white/40 truncate">
                    Смотрит: {friend.watching}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Пустой слот для добавления */}
        <button className="bg-[rgba(255,255,255,0.02)] border border-white/5 border-dashed rounded-[14px] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 cursor-pointer group min-h-[160px] flex flex-col items-center justify-center gap-2">
          <UserPlus className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors duration-300" />
          <span className="text-[13px] text-white/40 group-hover:text-white/60 transition-colors duration-300">
            Добавить друга
          </span>
        </button>
      </div>
    </div>
  );
};

export default Friends;
