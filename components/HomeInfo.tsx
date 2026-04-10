"use client"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";


export function HomeInfo() {
    const info = useRef<HTMLHeadingElement>(null);
    gsap.registerPlugin(SplitText, useGSAP, ScrollTrigger);

    useGSAP(() => {
        if (!info.current) return;

        const splitText = new SplitText(info.current, {
            type: "words",
            wordsClass: "word",
        });

        gsap.fromTo(splitText.words, {
            opacity: 0,
            y: 20,
        }, {
            scrollTrigger: {
                trigger: '.info',
                start: '50% 60%',
                end: '50% 60%',
                // markers: true,
            },
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out"
        });
    }, { scope: info });

    return (
        <>
            <div className="flex justify-evenly items-center h-screen page">
                <CardLayout />
                <h1 className="text-[2vw] font-bold w-[30%] font-sans info" ref={info}>Hand-poured with care, our candles are crafted to bring warmth, calm, and character to your space.</h1>
            </div>
        </>
    )
}

function CardLayout() {
    return (
        <>
            <div className="flex justify-evenly items-center gap-2">
                <div>
                    <img src={undefined} className="bg-blue-500 w-[200px] h-[410px] rounded-2xl " alt="" />
                </div>
                <div className="flex flex-col gap-2">
                    <img src={undefined} className="bg-blue-500 w-[200px] h-[200px] rounded-2xl " alt="" />
                    <img src={undefined} className="bg-blue-500 w-[200px] h-[200px] rounded-2xl" alt="" />
                </div>

            </div>
        </>
    )
}