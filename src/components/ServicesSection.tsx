import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, Flame, MessageCircle, ArrowRight, Package, UtensilsCrossed } from "lucide-react";

export function ServicesSection() {
  const getWhatsAppUrl = (productName: string) => {
    const text = `Halo Ricake! Saya tertarik ingin memesan / menanyakan tentang ${productName}. Boleh minta informasi harga, varian, dan ketersediaannya? Terima kasih!`;
    return `https://wa.me/${siteConfig.contact.whatsappRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section
      id="services"
      aria-label="What We Bake Section"
      className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-warm-ivory border-b-2 border-espresso/15"
    >
      <div className="max-w-container mx-auto flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-toasted-crust" />
              <span className="font-body text-xs font-extrabold uppercase tracking-widest text-toasted-crust">
                WHAT WE BAKE
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-espresso tracking-tight">
              Something Good for Every Craving.
            </h2>
            <p className="font-body text-base text-espresso/80 max-w-2xl mt-2 leading-relaxed">
              Temukan pilihan homemade dari Ricake. Pilih camilan favoritmu atau tanyakan kebutuhan pesanan kue yang ingin kamu buat.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="font-body text-xs font-bold uppercase px-3 py-1.5 bg-butter-cream rounded-full border border-espresso/20 text-bakery-brown">
              Fresh Batch Every Morning
            </span>
          </div>
        </div>

        {/* 1. FEATURED HERO PRODUCT: CHURROS FROZEN (Dual Representation: Frozen Packaging & Fried Serving) */}
        <div className="bg-paper-white rounded-xl border-2 border-espresso shadow-retro-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Column: Dual Presentation (6 Cols) */}
            <div className="lg:col-span-6 bg-espresso text-paper-white p-6 sm:p-8 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-espresso">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="font-body text-xs font-bold uppercase tracking-wider text-butter-yellow flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-butter-yellow" />
                    DUAL PRESENTATION · FROZEN & SERVED
                  </span>
                  <span className="font-body text-[11px] font-bold px-2.5 py-0.5 rounded bg-bakery-brown text-butter-cream border border-warm-grey/30">
                    Ricake Signature
                  </span>
                </div>

                {/* Two Visual Frames Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Frame 1: Frozen Packaging */}
                  <div className="rounded-lg overflow-hidden border-2 border-warm-grey/30 bg-cocoa flex flex-col group">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src="/images/products/churros-packaging.jpg"
                        alt="Kemasan Churros Frozen Ricake siap simpan di rumah"
                        fill
                        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 300px"
                      />
                    
                    </div>
                    <div className="p-3 bg-espresso text-xs border-t border-warm-grey/30">
                      <span className="font-bold text-butter-yellow block mb-0.5 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-butter-yellow" />
                        01. Kemasan Frozen Praktis
                      </span>
                      <span className="text-warm-ivory/80 text-[11px] leading-snug block">
                        Simpan dalam keadaan frozen di freezer rumah.
                      </span>
                    </div>
                  </div>

                  {/* Frame 2: Fried & Ready to Serve */}
                  <div className="rounded-lg overflow-hidden border-2 border-warm-grey/30 bg-cocoa flex flex-col group">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src="/images/products/churros.jpg"
                        alt="Churros hangat renyah siap disajikan dengan saus dipping"
                        fill
                        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 300px"
                      />
                      
                    </div>
                    <div className="p-3 bg-espresso text-xs border-t border-warm-grey/30">
                      <span className="font-bold text-butter-yellow block mb-0.5 flex items-center gap-1">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-butter-yellow" />
                        02. Siap Goreng & Renyah
                      </span>
                      <span className="text-warm-ivory/80 text-[11px] leading-snug block">
                        Goreng langsung saat ingin disajikan hangat.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Serving Tip Strip */}
              <div className="mt-4 pt-3 border-t border-warm-grey/30 flex items-center justify-between text-xs text-butter-cream">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-toasted-crust" />
                  Goreng pada minyak panas 2-3 menit hingga keemasan.
                </span>
                <span className="font-bold text-butter-yellow">Stok Camilan Rumah</span>
              </div>
            </div>

            {/* Details & Ordering Column (6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-md bg-powder-blue text-espresso font-body text-xs font-bold border border-espresso uppercase tracking-wider">
                    FROZEN TREATS
                  </span>
                  <span className="font-display font-extrabold text-sm sm:text-base px-3 py-1 bg-butter-yellow text-espresso rounded-md border border-espresso">
                    Mulai dari Rp25.000 / 2 box
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-espresso mb-2">
                  Churros Frozen
                </h3>

                <p className="font-body text-sm sm:text-base text-espresso/80 leading-relaxed mb-5">
                  Churros praktis dalam kemasan frozen untuk dinikmati di rumah. Simpan dalam keadaan frozen, lalu goreng saat ingin disajikan untuk kerenyahan sempurna dan tekstur lembut di dalam.
                </p>

                {/* Available Flavors Badges */}
                <div className="mb-5">
                  <span className="font-body text-xs font-bold uppercase tracking-wider text-bakery-brown block mb-2">
                    6 Pilihan Dipping Sauce & Varian Rasa:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Coklat Belgia", "Mango Puree", "Matcha Green Tea", "Strawberry Bliss", "Roasted Pistachio", "Tiramisu Crema"].map(
                      (flavor) => (
                        <span
                          key={flavor}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-warm-ivory text-espresso border border-espresso/20 shadow-sm"
                        >
                          {flavor}
                        </span>
                      )
                    )}
                  </div>
                  <p className="font-body text-[11px] text-espresso/60 mt-2 italic">
                    *Mulai dari Rp25.000 per 2 box. Varian rasa dan ketersediaan dapat dikonfirmasi saat pemesanan.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-espresso/15 flex flex-wrap items-center gap-3">
                <Link
                  href="/order"
                  className="flex-1 inline-flex items-center justify-center gap-2 font-body font-bold text-sm text-espresso bg-butter-yellow hover:bg-toasted-crust hover:text-paper-white py-3 px-6 rounded-lg border-2 border-espresso shadow-retro transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
                >
                  <span>Order Churros Online</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={getWhatsAppUrl("Churros Frozen")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-body font-bold text-sm text-espresso bg-paper-white hover:bg-warm-ivory py-3 px-5 rounded-lg border-2 border-espresso shadow-retro transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-toasted-crust" />
                  <span>Tanya via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 2. SUPPORTING PRODUCTS GRID (Custom Bolu, Brownies, Soft Cookies) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1: Custom Bolu */}
          <div className="bg-paper-white rounded-xl border-2 border-espresso shadow-retro-lg overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="relative h-48 bg-warm-ivory border-b-2 border-espresso overflow-hidden">
                <Image
                  src="/images/products/bolu.jpg"
                  alt="Custom Bolu Ricake dengan taburan keju dan pisang"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <span className="absolute top-2.5 left-2.5 font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-butter-cream text-bakery-brown border border-toasted-crust/40 rounded">
                  HOMEMADE CAKES
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-espresso mb-2">
                  Custom Bolu
                </h3>
                <p className="font-body text-xs sm:text-sm text-espresso/80 leading-relaxed mb-4">
                  Punya rasa bolu favorit atau kebutuhan kue untuk sebuah momen? Ricake menerima pertanyaan dan pesanan bolu custom sesuai pilihan yang tersedia: Bolu Keju Melimpah, Bolu Pisang Wangi, dan Bolu Cokelat Lembut.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-bakery-brown">
                  <span className="px-2 py-0.5 bg-warm-ivory rounded border border-espresso/20">Bolu Keju</span>
                  <span className="px-2 py-0.5 bg-warm-ivory rounded border border-espresso/20">Bolu Pisang</span>
                  <span className="px-2 py-0.5 bg-warm-ivory rounded border border-espresso/20">Bolu Cokelat</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-2">
              <Link
                href="/order"
                className="flex-1 text-center font-body font-bold text-xs sm:text-sm text-espresso bg-warm-ivory hover:bg-butter-yellow py-2.5 rounded-lg border-2 border-espresso shadow-retro transition-colors"
              >
                Pesan Bolu Online
              </Link>
              <a
                href={getWhatsAppUrl("Custom Bolu")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tanya via WhatsApp"
                className="p-2.5 bg-paper-white hover:bg-butter-cream text-espresso rounded-lg border-2 border-espresso shadow-retro transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 text-toasted-crust" />
              </a>
            </div>
          </div>

          {/* CARD 2: Brownies */}
          <div className="bg-paper-white rounded-xl border-2 border-espresso shadow-retro-lg overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="relative h-48 bg-espresso border-b-2 border-espresso overflow-hidden">
                <Image
                  src="/images/products/brownies.jpg"
                  alt="Brownies homemade cokelat fudgy dengan topping almond"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-warm-ivory text-espresso border border-espresso/30 rounded">
                    CHOCOLATE TREATS
                  </span>
                </div>
                <span className="absolute bottom-2.5 right-2.5 font-body text-[10px] font-bold px-2 py-0.5 bg-butter-yellow text-espresso rounded border border-espresso">
                  Fudgy & Shiny Crust
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-espresso mb-2">
                  Brownies
                </h3>
                <p className="font-body text-xs sm:text-sm text-espresso/80 leading-relaxed mb-4">
                  Pilihan camilan cokelat fudgy untuk menemani waktu santai atau dibagikan bersama orang tersayang. Dibuat dengan dark cocoa berkualitas dan taburan topping melimpah.
                </p>
                <p className="font-body text-[11px] text-warm-grey italic">
                  Tersedia untuk camilan keluarga dan hantaran acara spesial.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-2">
              <Link
                href="/order"
                className="flex-1 text-center font-body font-bold text-xs sm:text-sm text-paper-white bg-bakery-brown hover:bg-espresso py-2.5 rounded-lg border-2 border-espresso shadow-retro transition-colors"
              >
                Pesan Brownies
              </Link>
              <a
                href={getWhatsAppUrl("Brownies")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tanya via WhatsApp"
                className="p-2.5 bg-paper-white hover:bg-butter-cream text-espresso rounded-lg border-2 border-espresso shadow-retro transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 text-toasted-crust" />
              </a>
            </div>
          </div>

          {/* CARD 3: Soft Cookies */}
          <div className="bg-paper-white rounded-xl border-2 border-espresso shadow-retro-lg overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="relative h-48 bg-bakery-brown border-b-2 border-espresso overflow-hidden">
                <Image
                  src="/images/products/cookies.jpg"
                  alt="Artisan soft cookies dengan coklat leleh di tengah"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <span className="absolute top-2.5 left-2.5 font-body text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-toasted-crust text-paper-white border border-espresso rounded">
                  COOKIE COLLECTION
                </span>
                <span className="absolute bottom-2.5 right-2.5 font-body text-[10px] font-bold px-2 py-0.5 bg-butter-cream text-espresso rounded border border-espresso">
                  Lumer & Lembut
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-espresso mb-2">
                  Soft Cookies
                </h3>
                <p className="font-body text-xs sm:text-sm text-espresso/80 leading-relaxed mb-4">
                  Cookies bertekstur lembut dan lumer untuk teman ngemil, menemani waktu belajar, bekerja, atau berkumpul santai bersama orang terdekat di sore hari yang santai.
                </p>
                <p className="font-body text-[11px] text-warm-grey italic">
                  Cocok dinikmati langsung atau dihangatkan sebentar.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-2">
              <Link
                href="/order"
                className="flex-1 text-center font-body font-bold text-xs sm:text-sm text-espresso bg-warm-ivory hover:bg-butter-yellow py-2.5 rounded-lg border-2 border-espresso shadow-retro transition-colors"
              >
                Pesan Soft Cookies
              </Link>
              <a
                href={getWhatsAppUrl("Soft Cookies")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tanya via WhatsApp"
                className="p-2.5 bg-paper-white hover:bg-butter-cream text-espresso rounded-lg border-2 border-espresso shadow-retro transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 text-toasted-crust" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
