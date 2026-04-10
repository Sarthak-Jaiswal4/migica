"use client"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


export function HomePageCarosol() {
    const swiper = useSwiper();
    return (
        <>
        <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        onReachEnd={() => console.log('end')}   
        >
            <SwiperSlide className="h-[calc(100vh-50px)] bg-sky-900"><img src="vercel.svg" width="750vw" alt="" /></SwiperSlide>
            <SwiperSlide className="h-[calc(100vh-50px)] bg-sky-900"><img src="vercel.svg" width="750vw" alt="" /></SwiperSlide>
            <SwiperSlide className="h-[calc(100vh-50px)] bg-sky-900"><img src="vercel.svg" width="750vw" alt="" /></SwiperSlide>
            <SwiperSlide className="h-[calc(100vh-50px)] bg-sky-900"><img src="vercel.svg" width="750vw" alt="" /></SwiperSlide>
        </Swiper>
        </>
    )
}