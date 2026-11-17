"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ArrowLeft, Lock, Mail, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Pendaftaran gagal. Silakan coba kembali.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke portal pelanggan...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/portal");
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-xs font-bold text-toasted-crust hover:text-espresso mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 relative overflow-hidden rounded-md bg-paper-white border border-espresso flex items-center justify-center shadow-retro">
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="font-display font-extrabold text-2xl text-espresso">
            {siteConfig.name} Bakery
          </span>
        </div>

        <h1 className="mt-4 font-display font-extrabold text-3xl text-espresso tracking-tight">
          Gabung Bersama Ricake.
        </h1>
        <p className="mt-2 font-body text-sm text-espresso/80">
          Buat akun pelanggan untuk memudahkan pemesanan dan update promo kue homemade favoritmu.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-paper-white p-8 rounded-2xl border-2 border-espresso shadow-retro-xl space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-xs text-red-800 font-medium flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-300 text-xs text-green-800 font-medium flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label
                htmlFor="name"
                className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Kamu"
                  disabled={isLoading}
                  className="w-full bg-warm-ivory/50 text-espresso placeholder:text-warm-grey px-4 py-2.5 rounded-lg border border-espresso/30 text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body transition-all disabled:opacity-50"
                />
                <User className="absolute right-3 top-3 w-4 h-4 text-warm-grey" />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emailmu@gmail.com"
                  disabled={isLoading}
                  className="w-full bg-warm-ivory/50 text-espresso placeholder:text-warm-grey px-4 py-2.5 rounded-lg border border-espresso/30 text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body transition-all disabled:opacity-50"
                />
                <Mail className="absolute right-3 top-3 w-4 h-4 text-warm-grey" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1"
              >
                Password (min. 6 karakter)
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-warm-ivory/50 text-espresso placeholder:text-warm-grey px-4 py-2.5 rounded-lg border border-espresso/30 text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body transition-all disabled:opacity-50"
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-warm-grey" />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1"
              >
                Ulangi Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-warm-ivory/50 text-espresso placeholder:text-warm-grey px-4 py-2.5 rounded-lg border border-espresso/30 text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body transition-all disabled:opacity-50"
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-warm-grey" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-body font-bold text-sm text-espresso bg-butter-yellow hover:bg-toasted-crust hover:text-paper-white py-3 rounded-lg border-2 border-espresso shadow-retro-md transition-all active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <span>Daftar Akun Baru</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-espresso/15 flex flex-col gap-2 text-center font-body text-xs text-espresso/80">
            <div>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-bold text-toasted-crust hover:text-espresso hover:underline"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
