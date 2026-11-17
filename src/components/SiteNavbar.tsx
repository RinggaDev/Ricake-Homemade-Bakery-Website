"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, User, Shield, LogOut, ShoppingBag } from "lucide-react";

interface CurrentUser {
  name: string;
  role: string;
}

export function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ponytail: minimal client auth check via existing /api/auth/me
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.user) {
          setUser({ name: data.user.name, role: data.user.role });
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  const targetUrl = user?.role === "admin" ? "/admin" : "/portal";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-warm-ivory/95 backdrop-blur-md border-b border-espresso/10 transition-all">
      <div className="h-20 max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="#hero"
          className="flex items-center gap-3 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso rounded-lg p-1"
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-md bg-paper-white border border-espresso flex items-center justify-center shadow-retro">
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={40}
              height={40}
              className="object-contain p-0.5"
              priority
            />
          </div>
          <span className="font-display font-bold text-xl sm:text-2xl text-espresso tracking-tight flex items-baseline gap-1.5">
            {siteConfig.name}
            <span className="font-body text-xs font-normal text-bakery-brown hidden sm:inline tracking-normal">
              Homemade Bakery
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-1 lg:gap-2 py-1.5 px-3 bg-paper-white/80 rounded-xl border border-espresso/15 shadow-retro"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-1.5 text-sm font-medium text-espresso/80 hover:text-espresso hover:bg-butter-cream/70 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA & Account button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Order Online Button */}
          <Link
            href="/order"
            className="hidden sm:inline-flex items-center gap-1.5 font-body font-bold text-xs text-espresso bg-butter-yellow hover:bg-toasted-crust hover:text-paper-white px-3.5 py-2 rounded-lg border border-espresso shadow-retro transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pesan Online</span>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/portal/orders"
                className="inline-flex items-center gap-1 font-body text-xs font-bold text-toasted-crust hover:text-espresso px-2 py-1 rounded transition-colors"
                title="Lihat Pesanan Saya"
              >
                <span>Pesanan Anda</span>
              </Link>

              <Link
                href={targetUrl}
                className="inline-flex items-center gap-2 font-body text-xs font-bold text-espresso bg-paper-white hover:bg-butter-cream px-3 py-1.5 rounded-lg border border-espresso shadow-retro transition-all"
              >
                {user.role === "admin" ? (
                  <Shield className="w-3.5 h-3.5 text-toasted-crust" />
                ) : (
                  <User className="w-3.5 h-3.5 text-toasted-crust" />
                )}
                <span className="max-w-[110px] truncate">{user.name}</span>
                <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-espresso text-paper-white font-extrabold tracking-wider">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Keluar Sesi"
                className="p-2 rounded-lg border border-espresso bg-paper-white text-espresso hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors shadow-retro"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 font-body font-semibold text-sm text-espresso bg-warm-ivory hover:bg-butter-cream px-4 py-2 rounded-lg border border-espresso shadow-retro transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu navigasi"
            className="md:hidden p-2 rounded-lg border border-espresso bg-paper-white text-espresso shadow-retro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-warm-ivory border-b-2 border-espresso px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* ponytail: mobile user badge display */}
          {user && (
            <div className="mb-3 p-3 rounded-xl bg-paper-white border border-espresso/20 flex items-center justify-between shadow-retro-xs">
              <div className="flex items-center gap-2.5">
                {user.role === "admin" ? (
                  <Shield className="w-4 h-4 text-toasted-crust" />
                ) : (
                  <User className="w-4 h-4 text-toasted-crust" />
                )}
                <div>
                  <div className="font-body text-xs font-bold text-espresso">{user.name}</div>
                  <div className="font-body text-[10px] text-espresso/60 uppercase font-semibold">
                    Role: <span className="font-bold text-toasted-crust">{user.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={targetUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 rounded bg-butter-yellow border border-espresso text-xs font-bold text-espresso"
                >
                  {user.role === "admin" ? "Dashboard" : "Portal"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded text-red-600 hover:bg-red-50"
                  title="Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-base font-bold text-espresso bg-butter-yellow border border-espresso transition-colors shadow-retro flex items-center justify-between"
            >
              <span>Pesan Menu Online</span>
              <ShoppingBag className="w-4 h-4 text-espresso" />
            </Link>

            {user && (
              <Link
                href="/portal/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-base font-bold text-toasted-crust bg-paper-white border border-espresso/20 hover:bg-butter-cream transition-colors shadow-retro"
              >
                Pesanan Anda
              </Link>
            )}

            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-base font-semibold text-espresso bg-paper-white border border-espresso/20 hover:bg-butter-cream transition-colors shadow-retro"
              >
                {item.label}
              </Link>
            ))}

            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-base font-bold text-espresso bg-warm-ivory border border-espresso transition-colors shadow-retro text-center mt-1"
              >
                Masuk ke Akun (Login)
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
