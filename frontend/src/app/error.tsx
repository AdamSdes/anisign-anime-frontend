'use client'

import Header from "@/components/header/Header";
import { Report } from "@/components/report/report";
import Footer from "@/components/footer/Footer";

import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
    return (
        <main className="min-h-screen">
            <Header className="" />
            <Report className="" />
            <div className="h-[700px] flex flex-col gap-10 items-center justify-center">
                <Image
                    src="/404.png"
                    width={500}
                    height={500}
                    alt="404"
                />
                <p>Cтраница не найдена</p>
                <Link className='py-4 px-[35px] rounded-[12px] bg-white/5 border border-white/5 transition-all delay-150 hover:opacity-80' href="/">На сайт</Link>
            </div>
            <Footer />
        </main>
    )
}