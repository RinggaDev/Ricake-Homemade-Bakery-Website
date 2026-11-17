"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, BookOpen, X, Calendar, Sparkles } from "lucide-react";

interface DisplayArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  tag: string;
  tagVariant?: "butter" | "powder" | "default";
  thumbnail?: string;
}

export function NewsSection() {
  const initialArticles: DisplayArticle[] = siteConfig.articles.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    content: a.excerpt,
    date: a.date,
    tag: a.tag,
    tagVariant: (a.tagVariant === "warm" ? "default" : a.tagVariant) as any,
    thumbnail: "/images/products/churros.jpg",
  }));

  const [articles, setArticles] = useState<DisplayArticle[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<DisplayArticle | null>(null);

  useEffect(() => {
    async function loadPublishedNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.success && Array.isArray(data.news) && data.news.length > 0) {
          const mapped: DisplayArticle[] = data.news.map((n: any, idx: number) => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt || n.content?.slice(0, 120) || "",
            content: n.content,
            date: new Date(n.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            tag: idx % 3 === 0 ? "STORY" : idx % 3 === 1 ? "RECIPE & TIPS" : "SPECIAL ORDER",
            tagVariant: idx % 3 === 0 ? "butter" : idx % 3 === 1 ? "powder" : "default",
            thumbnail: n.thumbnail_path || "/images/products/churros.jpg",
          }));
          setArticles(mapped.slice(0, 6));
        }
      } catch {
        // Tetap gunakan initialArticles jika API belum siap
      }
    }

    loadPublishedNews();
  }, []);

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case "butter":
        return "bg-butter-cream text-bakery-brown border-toasted-crust/40";
      case "powder":
        return "bg-powder-blue text-espresso border-espresso";
      default:
        return "bg-warm-ivory text-espresso border-espresso/30";
    }
  };

  return (
    <section
      id="news"
      aria-label="News and Journal"
      className="w-full py-16 lg:py-24 bg-warm-ivory border-t-2 border-espresso/15 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-container mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-toasted-crust" />
              <span className="font-body text-xs font-extrabold uppercase tracking-widest text-toasted-crust">
                FROM THE RICAKE JOURNAL
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-espresso tracking-tight">
              Stories, Updates & a Little Something Sweet.
            </h2>
          </div>

          <Link
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 font-body font-bold text-sm text-espresso px-5 py-2.5 rounded-lg border-2 border-espresso bg-paper-white hover:bg-butter-yellow transition-all shadow-retro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
          >
            <span>Tanya Dapur Ricake</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Editorial Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <article
              key={article.id}
              className="bg-paper-white rounded-2xl border-2 border-espresso shadow-retro-lg overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div>
                {/* Thumbnail Header if available */}
                {article.thumbnail && (
                  <div className="relative aspect-[16/9] w-full bg-warm-ivory border-b-2 border-espresso overflow-hidden">
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-7 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span
                      className={`px-2.5 py-1 rounded uppercase tracking-wider border ${getBadgeStyle(
                        article.tagVariant
                      )}`}
                    >
                      {article.tag}
                    </span>
                    <span className="text-espresso/60 font-medium">{article.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-espresso group-hover:text-toasted-crust transition-colors mt-1">
                    {article.title}
                  </h3>

                  <p className="font-body text-xs sm:text-sm text-espresso/75 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-espresso/10">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="font-body text-xs sm:text-sm text-toasted-crust font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso rounded"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="flex md:hidden justify-center pt-2">
          <Link
            href="#contact"
            className="w-full text-center font-body font-bold text-sm text-espresso px-5 py-3 rounded-lg border-2 border-espresso bg-paper-white shadow-retro"
          >
            Hubungi Ricake via WhatsApp →
          </Link>
        </div>
      </div>

      {/* Modal Baca Artikel Lengkap */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-paper-white w-full max-w-2xl rounded-2xl border-2 border-espresso shadow-retro-xl p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-warm-ivory border border-espresso/30 text-espresso hover:bg-butter-yellow transition-colors"
              aria-label="Tutup artikel"
            >
              <X className="w-4 h-4" />
            </button>

            {selectedArticle.thumbnail && (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border-2 border-espresso mb-5">
                <Image
                  src={selectedArticle.thumbnail}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 text-xs font-bold text-espresso/70 mb-3">
              <span
                className={`px-2.5 py-0.5 rounded uppercase tracking-wider border ${getBadgeStyle(
                  selectedArticle.tagVariant
                )}`}
              >
                {selectedArticle.tag}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-toasted-crust" />
                <span>{selectedArticle.date}</span>
              </div>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-espresso mb-4">
              {selectedArticle.title}
            </h2>

            <div className="font-body text-sm text-espresso/85 leading-relaxed space-y-3 whitespace-pre-line mb-6">
              {selectedArticle.content || selectedArticle.excerpt}
            </div>

            <div className="pt-4 border-t border-espresso/15 flex items-center justify-between">
              <span className="font-body text-xs text-espresso/60 italic flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-toasted-crust" />
                <span>Dapur Ricake Homemade Bakery</span>
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-xs hover:bg-toasted-crust hover:text-paper-white transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
