'use client'
import { useState } from 'react';
import CharacterList from "@/widgets/CharacterList/CharacterList";
import Navbar from "@/widgets/Header/Header";
import Report from "@/features/Report/Report";
import Footer from "@/widgets/Footer/Footer";

const Page = () => {
    return (
        <div>
            <Navbar />
            <Report />
            <main className="container mx-auto mt-8 px-4 lg:mt-16">
                <div className="flex flex-col gap-8">
                    <CharacterList />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Page;
