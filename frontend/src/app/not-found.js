'use client';

import { Image } from "@nextui-org/image";
import { AButton } from "@/shared/anisign-ui/Button";
import { Link } from "@nextui-org/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="flex justify-center items-center flex-col gap-10 lg:gap-20">
                <Image
                    alt="NextUI 404 Image"
                    src="/404.png"
                    className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]" // Адаптивная ширина для разных экранов
                />
                <p className="text-[18px] sm:text-[24px] lg:text-[28px] font-semibold opacity-60 text-center">
                    Cтраница не найдена
                </p>
                <Link href="/">
                    <AButton className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg">
                        На сайт
                    </AButton>
                </Link>
            </div>
        </main>
    );
}
