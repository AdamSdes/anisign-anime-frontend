import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MessageCircle, Heart } from "lucide-react"
import { Comment } from './types'

interface RecentCommentProps {
    comment: Comment
}

const RecentComment = ({ comment }: RecentCommentProps) => {
    return (
        <div className="relative flex flex-col h-full p-6 rounded-[14px] border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-start gap-4 justify-between">
                <div className='flex items-center gap-3'>
                    <div className="relative w-11 h-11 rounded-full overflow-hidden">
                        <Image
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            width={44}
                            height={44}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-semibold text-[15px] text-white/90 truncate pr-2">
                        {comment.author.name}
                    </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                        <Heart className="w-3 h-3" />
                        <span>{comment.hearts || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/40 bg-white/[0.03] px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {comment.date}
                    </div>
                </div>
            </div>

            <div className="relative mt-[30px] pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5" />
                <p className="text-[14px] text-white/70 line-clamp-3 leading-relaxed">
                    {comment.content}
                </p>
            </div>

            <div className="mt-auto pt-[30px] flex items-center justify-between">
                <Link
                    href={`/anime/${comment.animeId}`}
                    className="flex items-center gap-2 group"
                >
                    <MessageCircle className="w-4 h-4 text-[#CCBAE4]/70 group-hover:text-[#CCBAE4] transition-colors" />
                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors truncate">
                        {comment.animeName}
                    </span>
                </Link>
                <span className="text-[10px] text-white/30 tabular-nums">#{comment.id}</span>
            </div>
        </div>
    )
}

export default RecentComment
