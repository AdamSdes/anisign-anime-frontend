'use client'
import React, { useState } from 'react';
import { Image } from "@nextui-org/react";
import {Chip} from "@nextui-org/chip";
import Link from "next/link";

export default function RelatedAnime() {


    return (
        <div className="container mx-auto max-w-[1400px] px-2 py-10">
            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-[20px] font-semibold">Связаное</p>
                </div>
                <div className="flex gap-8">
                    <Link href="/" className="hover:opacity-75 transition-all duration-300">
                        <div className="max-w-[155px] flex flex-col gap-3">
                            <Image
                                className="flex-shrink-0"
                                isZoomed
                                width={153}
                                height={214}
                                size="sm"
                                src="https://animego.org/media/cache/thumbs_250x350/upload/anime/images/5f7c1bb915a07033689374.jpg"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] opacity-60">Продолжение</p>
                                <h1 className="font-semibold text-[14px]">Магическая битва 2</h1>
                            </div>
                        </div>
                    </Link>
                    <Link href="/" className="hover:opacity-75 transition-all duration-300">
                        <div className="max-w-[155px] flex flex-col gap-3">
                            <Image
                                className="flex-shrink-0"
                                isZoomed
                                width={153}
                                height={214}
                                size="sm"
                                src="https://animego.org/upload/anime/images/632b37f059836938947794.jpg"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] opacity-60">Предыстория</p>
                                <h1 className="font-semibold text-[14px]">Магическая битва 0. Фильм</h1>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
