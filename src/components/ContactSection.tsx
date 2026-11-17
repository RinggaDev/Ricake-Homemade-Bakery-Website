"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ExternalLink } from "lucide-react";

export function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "churros",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <section
      id="contact"
      aria-label="Contact Section"
      className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-paper-white"
    >
      <div className="max-w-container mx-auto flex flex-col gap-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-toasted-crust" />
            <span className="font-body text-xs font-extrabold uppercase tracking-widest text-toasted-crust">
              GET IN TOUCH
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-espresso tracking-tight">
            Let's Make Something Sweet.
          </h2>
          <p className="font-body text-base text-espresso/80 mt-2 leading-relaxed">
            Punya pertanyaan tentang produk, ingin memesan kue custom, atau ingin mengetahui ketersediaan produk? Hubungi Ricake.
          </p>
        </div>

        {/* Main Contact Container in Espresso */}
        <div className="w-full rounded-2xl bg-espresso text-warm-ivory p-6 sm:p-10 border-2 border-espresso shadow-retro-orange grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Info & Interactive Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-warm-grey/30">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-butter-yellow shrink-0 mt-0.5" />
                <div>
                  <span className="font-body text-xs uppercase tracking-wider text-warm-grey font-bold block">
                    Alamat Dapur
                  </span>
                  <p className="font-body text-xs sm:text-sm text-paper-white mt-0.5 leading-snug">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-butter-yellow shrink-0 mt-0.5" />
                <div>
                  <span className="font-body text-xs uppercase tracking-wider text-warm-grey font-bold block">
                    WhatsApp / Telepon
                  </span>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs sm:text-sm text-paper-white hover:text-butter-yellow transition-colors mt-0.5 inline-block font-semibold"
                  >
                    {siteConfig.contact.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-butter-yellow shrink-0 mt-0.5" />
                <div>
                  <span className="font-body text-xs uppercase tracking-wider text-warm-grey font-bold block">
                    Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="font-body text-xs sm:text-sm text-paper-white hover:text-butter-yellow transition-colors mt-0.5 inline-block"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-butter-yellow shrink-0 mt-0.5" />
                <div>
                  <span className="font-body text-xs uppercase tracking-wider text-warm-grey font-bold block">
                    Jam Buka
                  </span>
                  <p className="font-body text-xs sm:text-sm text-paper-white mt-0.5">
                    {siteConfig.contact.openingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-body text-xs text-warm-ivory uppercase tracking-wider font-bold block mb-1"
                  >
                    Nama Lengkap <span className="text-butter-yellow">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Sarah Anindya"
                    className="w-full bg-paper-white text-espresso placeholder:text-warm-grey px-4 py-2.5 rounded-lg border border-warm-grey text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-detail"
                    className="font-body text-xs text-warm-ivory uppercase tracking-wider font-bold block mb-1"
                  >
                    Email / WhatsApp <span className="text-butter-yellow">*</span>
                  </label>
                  <input
                    id="contact-detail"
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="0812xxxx atau nama@email.com"
                    className="w-full bg-paper-white text-espresso placeholder:text-warm-grey px-4 py-2.5 rounded-lg border border-warm-grey text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-category"
                  className="font-body text-xs text-warm-ivory uppercase tracking-wider font-bold block mb-1"
                >
                  Kategori Minat / Subjek
                </label>
                <select
                  id="contact-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-paper-white text-espresso px-4 py-2.5 rounded-lg border border-warm-grey text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body"
                >
                  <option value="churros">Pemesanan Churros Frozen (Grosir / Satuan)</option>
                  <option value="custom_cake">Pesanan Custom Bolu & Acara Spesial</option>
                  <option value="brownies_cookies">Tanya Brownies & Soft Cookies</option>
                  <option value="general">Pertanyaan Umum & Kemitraan</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="font-body text-xs text-warm-ivory uppercase tracking-wider font-bold block mb-1"
                >
                  Pesan atau Kebutuhan Spesifik <span className="text-butter-yellow">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan varian rasa yang diinginkan, tanggal pengiriman, atau detail pesanan kue..."
                  className="w-full bg-paper-white text-espresso placeholder:text-warm-grey px-4 py-2.5 rounded-lg border border-warm-grey text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 font-body font-bold text-sm text-espresso bg-butter-yellow hover:bg-toasted-crust hover:text-paper-white px-8 py-3 rounded-lg border-2 border-espresso shadow-retro-md transition-all transform active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter-yellow"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
                <span className="font-body text-xs text-warm-grey">
                  Respon ramah dalam 1x24 jam
                </span>
              </div>

              {formSubmitted && (
                <div
                  role="status"
                  className="p-4 rounded-xl bg-butter-cream text-espresso text-sm flex items-start gap-3 border-2 border-espresso animate-in fade-in duration-200 mt-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-toasted-crust shrink-0 mt-0.5" />
                  <p className="font-body">
                    <strong>Terima kasih {formData.name}!</strong> Pesanmu telah diterima oleh tim baker Ricake. Kami segera menghubungi via WhatsApp/Email.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Right: Map Area Embed */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="font-body text-xs uppercase tracking-wider text-butter-yellow mb-2 flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Lokasi Dapur / Pick-Up Point
              </span>
              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] hover:underline"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="w-full flex-1 min-h-[320px] lg:min-h-[440px] rounded-xl overflow-hidden border-2 border-warm-grey/40 relative bg-cocoa flex flex-col justify-between">
              {/* Google Maps Real Iframe Embed */}
              <iframe
                title="Peta Lokasi Ricake Homemade Bakery"
                src={siteConfig.contact.googleMapsEmbedUrl}
                className="w-full h-full min-h-[320px] lg:min-h-[440px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              {/* Map Floating Card Overlay */}
              <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-xs z-10 p-3 bg-paper-white/95 backdrop-blur-sm rounded-lg border-2 border-espresso shadow-retro pointer-events-none">
                <div className="flex items-center gap-2 text-toasted-crust">
                  <span className="font-display font-bold text-sm text-espresso">
                    Ricake Bakery Kitchen
                  </span>
                </div>
                <p className="font-body text-xs text-espresso/70 mt-1 leading-snug">
                  Indo Alam Residence Citayam. Tersedia layanan pick-up & pengiriman kurir.
                </p>
                <div className="mt-2 pt-2 border-t border-espresso/15 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-bakery-brown">Pick-up Available</span>
                  <span className="text-espresso/50">Citayam, Bogor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
