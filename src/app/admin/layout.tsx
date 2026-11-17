"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pesanan Masuk", icon: ShoppingBag },
  { href: "/admin/news", label: "Berita & Konten", icon: Newspaper },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/roles", label: "Peran (Roles)", icon: ShieldCheck },
  { href: "/admin/profile", label: "Profil & Keamanan", icon: KeyRound },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-warm-ivory flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-espresso text-warm-ivory px-4 py-3 flex items-center justify-between border-b-2 border-espresso sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 relative overflow-hidden rounded bg-paper-white p-0.5 border border-espresso">
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span className="font-display font-black text-lg tracking-tight text-paper-white">
            Ricake Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-espresso text-butter-yellow hover:bg-toasted-crust border border-butter-yellow/30"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-espresso text-paper-white flex flex-col justify-between p-5 border-r-2 border-espresso z-40 transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 pb-5 border-b border-paper-white/10">
            <div className="h-10 w-10 relative overflow-hidden rounded-lg bg-paper-white p-1 border border-butter-yellow shadow-retro-sm">
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-display font-black text-xl text-paper-white leading-tight">
                Ricake
              </div>
              <div className="flex items-center gap-1 font-body text-[10px] text-butter-yellow font-bold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Dashboard Admin</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-body text-xs font-bold transition-all ${
                    isActive
                      ? "bg-butter-yellow text-espresso shadow-retro-sm"
                      : "text-paper-white/80 hover:bg-paper-white/10 hover:text-paper-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-espresso" : "text-butter-yellow"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2 pt-4 border-t border-paper-white/10">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-paper-white/70 hover:text-butter-yellow hover:bg-paper-white/5 font-body text-xs font-semibold transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </span>
            <span className="text-[10px] bg-paper-white/10 px-1.5 py-0.5 rounded text-paper-white/70">
              Live
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-red-300 hover:text-red-100 hover:bg-red-950/40 font-body text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
