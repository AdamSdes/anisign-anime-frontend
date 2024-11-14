import Header from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import AnimeCarousel from "@/widgets/Carousel/AnimeCarousel";
import Calendar from "@/widgets/Calendar/Calendar";
import Comments from "@/widgets/Comments/Comments";
import Collection from "@/widgets/Collections/Collections";
import Footer from "@/shared/ui/Footer/Footer";
import {Button} from "@/shared/shadcn-ui/button";
import {ChevronRight} from "lucide-react";
import React from "react";
import Link from "next/link";

const Page = () => {
    return (
        <>
            <Header/>
            <Report/>
            <main className="anim-test">
                <AnimeCarousel/>
                <div className="container w-full h-[1px] mb-[30px] bg-white/5"></div>
                <div className="container mx-auto px-2 py-5 flex justify-between items-center">
                    <p className="text-[18px] lg:text-[20px] font-bold">Календарь</p>
                    <Link href="/calendar">
                        <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </Link>
                </div>
                <Calendar/>
                <div className="mb-[50px]">
                    <div className="container mx-auto px-2 py-5 flex justify-between items-center">
                        <p className='text-[20px] font-bold'>Комментарии</p>
                        <Link href="/comments">
                            <Button variant="outline" size="icon">
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </Link>
                    </div>
                    <Comments/>
                </div>
            </main>
        </>

    );
};

export default Page;