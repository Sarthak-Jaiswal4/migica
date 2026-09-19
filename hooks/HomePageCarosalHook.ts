import { HeroSlide } from "@/components/HomePageCarouselClient";
import type { HeroMedia } from "@/lib/showcase";


export async function HomePageCarosalHook():Promise<HeroSlide[]>{
    try {
        let slides:HeroSlide[]=[]

        const response =await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/showcase/hero-media`,
            {
                cache: "no-store",
            }
        );
    
        if (!response.ok) {
            return [];
        }
    
        const data=await response.json();
    
        if (!data?.items?.length) {
            return [];
        }
    
        if(response.ok){
            if (data?.items?.length) {
                slides=((data.items as HeroMedia[]).map((item) => ({
                imageSrc: item.url,
                mediaType: item.mediaType,
                imageAlt: item.alt || item.title || "Silver Star collection",
                eyebrow: "Silver Star",
                headline: item.title || "For the evenings you don't want to end.",
                body: item.description || "Hand-poured light, metal and cloth we actually live with.",
                primaryHref: "/shop/all",
                primaryLabel: "Wander the shelves",
              })));
            }
        }
    
        return slides
    } catch (error) {
        console.log("Error in fetching homepageCarosal images",error)
        return []
    }
}