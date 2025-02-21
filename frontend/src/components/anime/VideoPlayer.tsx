"use client";
import React, { useEffect, useState } from "react";
import { Film, BugPlay, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EpisodeController } from "./EpisodeController";
import { toast } from "sonner";
import { useAuthStore } from '@/hooks/useAuth';

interface VideoPlayerProps {
  shikimoriId: string;
  totalEpisodes?: number;
  animeName?: string;
  animeId: string;
}

const VideoPlayer = ({
  shikimoriId,
  totalEpisodes = 12,
  animeName = '',
  animeId,
}: VideoPlayerProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [lastEpisodeWatched, setLastEpisodeWatched] = useState(4);
  const { user } = useAuthStore();

  const createIframe = (src: string) => {
    const iframe = document.createElement("iframe");
    iframe.src = src.startsWith("//") ? `https:${src}` : src;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.border = "none";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("webkitallowfullscreen", "true");
    iframe.setAttribute("mozallowfullscreen", "true");

    iframe.allow = "fullscreen; autoplay; encrypted-media";
    iframe.setAttribute("referrerpolicy", "origin");
    iframe.setAttribute(
      "sandbox",
      "allow-forms allow-scripts allow-same-origin allow-presentation"
    );

    return iframe;
  };

  useEffect(() => {
    if (!shikimoriId) return;

    const container = document.getElementById("kodik-player");
    if (!container) return;

    const params = new URLSearchParams({
      shikimoriID: shikimoriId,
      hide_selectors: "false",
    });

    const cleanup = () => {
      const frame = container.querySelector("iframe");
      if (frame) {
        frame.remove();
      }
    };

    cleanup();
    const iframe = createIframe(`https://kodik.info/find-player?${params}`);
    container.appendChild(iframe);

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("kodik.info")) return;

      try {
        const data =
          typeof event.data === "object" ? event.data : JSON.parse(event.data);
        if (data?.type === "kodik_player_info") {
          setLoading(false);
        }
      } catch {
        // Silently ignore parsing errors
      }
    };

    window.addEventListener("message", handleMessage, false);
    return () => {
      cleanup();
      window.removeEventListener("message", handleMessage);
    };
  }, [shikimoriId]);

  const handleReportError = () => {
    window.open("https://t.me/anisignru", "_blank");
  };

  const handleEpisodeChange = (episode: number) => {
    setCurrentEpisode(episode);
    console.log(`Переключение на эпизод ${episode}`);
    setLastEpisodeWatched(Math.max(lastEpisodeWatched, episode));

    toast.success(`Эпизод ${episode}`, {
      description: "Переключение эпизода...",
      duration: 2000,
    });

    // Здесь можно добавить логику для смены эпизода в плеере
  };

  if (error) {
    return (
      <div className="w-full aspect-video rounded-[14px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white/80 text-center">
          <p className="text-lg mb-2">Видео не найдено</p>
          <p className="text-sm">Попробуйте позже</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-white/60" />
          <h3 className="text-[16px] font-semibold">Смотреть онлайн</h3>
        </div>
        {loading && (
          <Button
            onClick={handleReportError}
            variant="ghost"
            className="h-8 px-3 text-[#FF9494] hover:text-[#FF9494]/80 hover:bg-[#FF9494]/10 transition-colors z-20"
          >
            <BugPlay className="w-4 h-4 mr-2" />
            <span className="text-sm">Сообщить об ошибке</span>
          </Button>
        )}
      </div>

      <div className="relative isolate">
        {/* Эффект свечения */}
        <div
          className="absolute -inset-4 opacity-5 rounded-[20px] animate-glow"
          style={{
            background: `
                            radial-gradient(circle at 50% 50%, 
                                rgba(147, 51, 234, 0.2),
                                rgba(37, 99, 235, 0.2) 25%,
                                rgba(234, 51, 147, 0.2) 50%,
                                transparent 70%
                            )
                        `,
            filter: "blur(70px)",
            zIndex: -1,
            animation: "glow 8s ease-in-out infinite",
          }}
        />

        <style jsx>{`
          @keyframes glow {
            0% {
              transform: scale(1.1) translate(0, 0);
              opacity: 1;
            }
            25% {
              transform: scale(1.15) translate(130px, -10px);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.1) translate(0, 0);
              opacity: 1;
            }
            75% {
              transform: scale(1.15) translate(-130px, 10px);
              opacity: 0.6;
            }
            100% {
              transform: scale(1.1) translate(0, 0);
              opacity: 1;
            }
          }
        `}</style>

        <div className="flex mb-5 items-center gap-3 p-4 rounded-xl bg-[#FFF4D4]/10 border border-[#FFE4A0]/20">
          <AlertTriangle className="w-5 h-5 text-[#FFE4A0]" />
          <p className="text-[#FFE4A0]/90 text-sm">
            Если видео долго загружается, попробуйте перемотать немного вперёд с
            помощью ползунка
          </p>
        </div>

        {/* Основной плеер */}
        <div
          id="kodik-player"
          className="w-full aspect-video rounded-[14px] h-[500px] sm:h-[500px] lg:h-[700px] overflow-hidden bg-black/80 relative"
        />
      </div>

      {/* Episode Controller */}
      {user?.id && (
        <EpisodeController
          animeId={animeId}
          userId={user.id}
          totalEpisodes={totalEpisodes}
          animeName={animeName}
        />
      )}
    </section>
  );
};

export default VideoPlayer;
