import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Home, Cookie, Cake, Award } from "lucide-react";

export function AboutSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "cottage":
        return <Home className="w-5 h-5 text-espresso" />;
      case "cookie":
        return <Cookie className="w-5 h-5 text-espresso" />;
      case "cake":
        return <Cake className="w-5 h-5 text-espresso" />;
      default:
        return <Award className="w-5 h-5 text-espresso" />;
    }
  };

  return (
    <section
      id="about"
      aria-label="About Section"
      className="w-full py-16 lg:py-24 bg-paper-white border-y-2 border-espresso/15 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Side: Editorial Preparation Photo */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl border-2 border-espresso bg-warm-ivory p-3 shadow-retro-xl">
              <div className="relative w-full h-[380px] sm:h-[460px] rounded-xl overflow-hidden">
                <Image
                  src="/images/about-baker.jpg"
                  alt="Proses pembuatan dan taburan adonan kue artisan dapur Ricake"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>

              {/* Artisan Quality Badge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-powder-blue border-2 border-espresso px-4 py-2.5 rounded-lg shadow-retro">
                <p className="font-body text-xs sm:text-sm font-bold text-espresso flex items-center gap-1.5">
                  <span className="text-base">💛</span>
                  {siteConfig.aboutHighlight}
                </p>
              </div>
            </div>
          </div>

          {/* Text & Strengths Side */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-toasted-crust" />
              <span className="font-body text-xs font-extrabold uppercase tracking-widest text-toasted-crust">
                OUR STORY
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-espresso tracking-tight">
              Homemade Treats, Made for Your Moments.
            </h2>

            <p className="font-body text-base sm:text-lg text-espresso/80 leading-relaxed">
              {siteConfig.aboutText}
            </p>

            {/* 3 Key Strengths Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {siteConfig.strengths.map((strength) => (
                <div
                  key={strength.number}
                  className="p-4 rounded-xl bg-warm-ivory/80 border-2 border-espresso shadow-retro flex flex-col gap-2 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-black text-toasted-crust">
                      {strength.number}
                    </span>
                    {getIcon(strength.icon)}
                  </div>
                  <h3 className="font-display font-bold text-base text-espresso">
                    {strength.title}
                  </h3>
                  <p className="font-body text-xs text-espresso/70 leading-relaxed">
                    {strength.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
