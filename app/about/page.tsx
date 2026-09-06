import type { Metadata } from "next";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { OwnerSection } from "@/components/about/OwnerSection";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { ExhibitionGallery } from "@/components/about/ExhibitionGallery";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { AboutCTA } from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Silver Star.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-full bg-background">
      <Headers />
      <main>
        <AboutHero />
        <OwnerSection />
        <JourneyTimeline />
        <ExhibitionGallery />
        <AboutTestimonials />
        <AboutCTA />
      </main>
      <Footer />
    </div>
  );
}