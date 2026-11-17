import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, Utensils, MessageCircle, CheckCircle2, Cookie } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="w-full relative overflow-hidden pt-8 pb-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-warm-ivory"
    >
      <div className="max-w-container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Narrative & Action */}
        <div className="lg:col-span-7 flex flex-col items-start gap-5 z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-cream text-bakery-brown border border-toasted-crust/40 shadow-sm">
            <Sparkles className="w-4 h-4 text-toasted-crust" />
            <span className="font-body text-xs font-bold tracking-widest uppercase">
              HOMEMADE BAKERY
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-espresso leading-[1.1] tracking-tight">
            Good Things Are <br className="hidden sm:inline" />
            <span className="text-toasted-crust relative inline-block">
              Baked at Home.
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-butter-yellow -z-10"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 200 12"
                aria-hidden="true"
              >
                <path
                  d="M0,7 C50,14 150,0 200,8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="7"
                />
              </svg>
            </span>
          </h1>

          {/* Indonesian Subheadline */}
          <p className="font-body text-base sm:text-lg text-espresso/80 max-w-xl leading-relaxed">
            {siteConfig.shortDescription}
          </p>

          {/* Tagline Banner */}
          <div className="w-full sm:w-auto p-4 bg-paper-white rounded-xl border-2 border-espresso flex items-center gap-3 shadow-retro">
            <p className="font-display text-base sm:text-lg text-espresso font-bold italic">
              “{siteConfig.brandTagline}”
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              href="#services"
              className="inline-flex items-center justify-center gap-2 font-body font-bold text-base text-espresso bg-butter-yellow hover:bg-toasted-crust hover:text-paper-white px-7 py-3.5 rounded-lg border-2 border-espresso shadow-retro-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
            >
              <span>Explore Our Menu</span>
              <Utensils className="w-4 h-4" />
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 font-body font-bold text-base text-paper-white bg-bakery-brown hover:bg-espresso px-7 py-3.5 rounded-lg border-2 border-espresso shadow-retro-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
            >
              <span>Order Now</span>
              <MessageCircle className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-espresso/80 font-body text-xs sm:text-sm font-semibold tracking-wide">
            {siteConfig.trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-toasted-crust" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Bento Feature */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0">
          <div className="relative w-full rounded-2xl bg-paper-white p-3 border-2 border-espresso shadow-retro-xl rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden bg-espresso/5">
              <Image
                src="/images/hero-bakes.jpg"
                alt="Pilihan sajian artisan churros, bolu, brownies, dan cookies hangat buatan Ricake"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />

              {/* Floating Artisan Tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-paper-white/95 backdrop-blur-sm p-3.5 rounded-lg border-2 border-espresso flex items-center justify-between shadow-retro">
                <div>
                  <span className="font-body text-xs font-bold text-toasted-crust uppercase tracking-wider block">
                    Daily Kitchen Drop
                  </span>
                  <span className="font-display font-bold text-base sm:text-lg text-espresso">
                    Artisan Churros & Bolu
                  </span>
                </div>
                <span className="font-body text-xs px-2.5 py-1 bg-butter-cream text-espresso font-bold rounded border border-espresso">
                  Fresh Batch
                </span>
              </div>
            </div>
          </div>

          {/* Accent Floating Sticker */}
          <div className="absolute -top-4 -right-2 bg-butter-yellow border-2 border-espresso rounded-full w-20 h-20 flex flex-col items-center justify-center text-center shadow-retro -rotate-12">
            <Cookie className="w-5 h-5 text-espresso" />
            <span className="font-display text-xs font-extrabold text-espresso leading-none mt-0.5">
              EST.<br />2024
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
