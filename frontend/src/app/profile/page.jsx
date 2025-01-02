"use client"

import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import Profile from "@/widgets/Profile/Profile";
import Statistics from "@/widgets/Profile/Statistics";
import Anime from "@/widgets/Profile/Anime";
import History from "@/widgets/Profile/History";
import Friends from "@/widgets/Profile/Friends";
import Footer from "@/widgets/Footer/Footer";

export default function Page() {
    return (
        <>
            <Header />
            <Report />
            <Profile />
            <div className="container mx-auto max-[1000px]:flex mt-[120px] flex-col mb-20 min-[1000px]:grid grid-cols-[1fr_1px_373px] gap-[43px]">
                <div className="flex flex-col gap-[46px]">
                    <Statistics />
                    <Anime />
                </div>

                <div className="w-[1px] h-full bg-white/5 min-[1000px]:block none" />

                <div className="flex flex-col gap-[46px] min-[1000px]:opacity-50 transition-opacity duration-300 hover:opacity-100">
                    <Friends />
                    <History />
                </div>
            </div>
            <Footer/>
        </>
    );
}