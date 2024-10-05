'use client'
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/shared/shadcn-ui/avatar";

const CommentCard = ({avatar, username, time, commentText, animeTitle}) => {

    return (
        <div
            className="flex flex-col rounded-[10px] border bg-[rgba(255,255,255,0.02)] p-[25px] justify-between w-full gap-[15px]">
            <div className="flex gap-2">
                <Avatar className="w-[47px] h-[47px]">
                    <AvatarImage src={avatar} alt={`Avatar of ${username}`}/>
                    <AvatarFallback>{username.substring(1, 3)}</AvatarFallback>
                </Avatar>
                <div>
                    <Link
                        href=""
                        className="text-[14px] font-semibold hover:opacity-50 transition-opacity duration-300"
                    >
                        {username}
                    </Link>
                    <p className="text-[12px] opacity-60 font-medium">{time}</p>
                </div>
            </div>
            <p className="max-w-[480px]">{commentText}</p>
            <button
                className="flex items-center gap-2 hover:opacity-50 transition-opacity duration-300"
                aria-label={`View more about ${animeTitle}`}
            >
                <img src="doc.svg" alt="Document icon"/>
                <p className="text-[#B6D0F7]">{animeTitle}</p>
                <img src="right.svg" alt="Right arrow icon"/>
            </button>
        </div>
    );
};

export default CommentCard;
