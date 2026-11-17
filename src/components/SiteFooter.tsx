import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Instagram, MessageCircle, Mail, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram className="w-4 h-4" />;
      case "WhatsApp":
        return <MessageCircle className="w-4 h-4" />;
      case "Email":
        return <Mail className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <footer className="w-full bg-espresso text-warm-ivory pt-16 pb-12 border-t-2 border-espresso selection:bg-butter-yellow selection:text-espresso">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & Story Column (5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-paper-white border border-warm-grey/30 flex items-center justify-center shadow-retro">
                <Image
                  src={siteConfig.logo.src}
                  alt={siteConfig.logo.alt}
                  width={38}
                  height={38}
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-paper-white tracking-tight flex items-baseline gap-2">
                Ricake<span className="text-butter-yellow">.</span>
                <span className="font-body text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 bg-bakery-brown text-butter-cream border border-warm-grey/30 rounded">
                  Bakery
                </span>
              </span>
            </div>

            <p className="font-display text-base font-bold text-butter-yellow italic">
              “{siteConfig.brandTagline}”
            </p>

            <p className="font-body text-xs sm:text-sm text-warm-ivory/80 max-w-sm leading-relaxed">
              Handcrafted artisan bakes, churros frozen, dan aneka bolu serta cookies buatan dapur rumah untuk menemani momen santai dan hari-hari spesialmu.
            </p>
          </div>

          {/* Quick Navigation Links (3 Cols) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-body text-xs font-bold text-butter-yellow uppercase tracking-widest">
              Quick Navigation
            </span>
            <div className="flex flex-col gap-2.5 font-body text-sm text-warm-ivory/80">
              <Link href="#hero" className="hover:text-butter-yellow transition-colors inline-flex items-center gap-1">
                <span>Home / Overview</span>
              </Link>
              <Link href="#about" className="hover:text-butter-yellow transition-colors inline-flex items-center gap-1">
                <span>Our Story & Heritage</span>
              </Link>
              <Link href="#services" className="hover:text-butter-yellow transition-colors inline-flex items-center gap-1">
                <span>What We Bake (Menu)</span>
              </Link>
              <Link href="#news" className="hover:text-butter-yellow transition-colors inline-flex items-center gap-1">
                <span>Fresh Bakes & Journal</span>
              </Link>
              <Link href="#contact" className="hover:text-butter-yellow transition-colors inline-flex items-center gap-1">
                <span>Visit Kitchen & Contact</span>
              </Link>
              <Link href="/login" className="hover:text-butter-yellow transition-colors inline-flex items-center gap-1 pt-1 text-xs text-butter-cream">
                <span>Login Portal</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Connect Column (4 Cols) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-body text-xs font-bold text-butter-yellow uppercase tracking-widest">
              Connect With Us
            </span>
            <p className="font-body text-xs sm:text-sm text-warm-ivory/80 leading-relaxed">
              Ikuti kabar terbaru seputar dapur kami, rilis batch kue harian, dan cerita manis dari Ricake.
            </p>
            <div className="flex items-center gap-3 mt-1">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-10 h-10 rounded-lg bg-bakery-brown border border-warm-grey/30 flex items-center justify-center text-warm-ivory hover:bg-butter-yellow hover:text-espresso transition-all shadow-sm hover:-translate-y-0.5"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-warm-grey/25 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-warm-ivory/60">
          <span>
            © {new Date().getFullYear()} {siteConfig.name} Homemade Bakery. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="#hero" className="hover:text-butter-yellow transition-colors">
              Privacy Policy
            </Link>
            <Link href="#hero" className="hover:text-butter-yellow transition-colors">
              Terms of Service
            </Link>
            <Link href="#hero" className="hover:text-butter-yellow transition-colors">
              Kitchen Hygiene Standards
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
