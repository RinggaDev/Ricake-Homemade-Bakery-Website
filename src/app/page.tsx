import { SiteNavbar } from "@/components/SiteNavbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { NewsSection } from "@/components/NewsSection";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory text-espresso">
      {/* Top Navigation */}
      <SiteNavbar />

      {/* Main Single-Page Content Flow */}
      <main className="flex-1 pt-20">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. About */}
        <AboutSection />

        {/* 3. Services / Products */}
        <ServicesSection />

        {/* 4. News / Journal */}
        <NewsSection />

        {/* 5. Contact + Google Maps */}
        <ContactSection />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
