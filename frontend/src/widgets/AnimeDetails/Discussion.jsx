'use client'
import React, { useState } from 'react';
import {AButton} from "@/shared/anisign-ui/Button";

export default function Discussion() {


    return (
        <>
            <div className="container mx-auto px-2 py-10">
                <div className="flex justify-between mb-[30px]">
                    <p>Обсуждение (6)</p>
                    <AButton
                        color="border">
                        <span>25</span>Отзывов
                    </AButton>
                </div>


            </div>
        </>
    );
}
