"use client";

import React, { useEffect, useState } from "react";
import {
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  User,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setProfile(data.user);
        }
      } catch {
        setMessage({ type: "error", text: "Gagal memuat profil pengguna." });
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password baru tidak cocok." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah password." });
        setSaving(false);
        return;
      }

      setMessage({
        type: "success",
        text: "Password admin berhasil diperbarui! Gunakan password baru ini saat login berikutnya.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan jaringan saat mengubah password." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-espresso mb-2" />
        <p className="font-body text-xs text-espresso/70">Memuat data akun...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-espresso tracking-tight">
          Profil & Keamanan Akun
        </h1>
        <p className="font-body text-xs sm:text-sm text-espresso/70 mt-1">
          Kelola informasi administrator Ricake dan perbarui kata sandi secara berkala.
        </p>
      </div>

      {/* Alert Pengingat Ganti Password Default */}
      <div className="bg-butter-cream border-2 border-dashed border-toasted-crust rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-toasted-crust text-paper-white shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-sm text-espresso">
            Wajib Dilakukan: Amankan Akun Administrator
          </h2>
          <p className="font-body text-xs text-espresso/80 leading-relaxed">
            Jika Anda masih menggunakan password awal <code className="font-bold text-espresso bg-warm-ivory px-1.5 py-0.5 rounded border border-espresso/20">123456</code>, harap segera ubah ke kata sandi yang kuat dan unik melalui formulir di bawah ini sebelum mempublikasikan website ke domain Vercel.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-body font-medium flex items-center gap-2.5 animate-fadeIn ${
            message.type === "success"
              ? "bg-green-50 border-green-300 text-green-900"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Info Profil */}
      <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-md">
        <h2 className="font-display font-extrabold text-lg text-espresso mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-toasted-crust" />
          <span>Informasi Administrator</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-body text-xs">
          <div className="p-3.5 bg-warm-ivory/60 rounded-xl border border-espresso/15">
            <span className="text-espresso/60 block mb-1">Nama:</span>
            <span className="font-bold text-espresso text-sm">{profile?.name || "Administrator"}</span>
          </div>
          <div className="p-3.5 bg-warm-ivory/60 rounded-xl border border-espresso/15">
            <span className="text-espresso/60 block mb-1">Email:</span>
            <span className="font-mono font-bold text-espresso text-xs">{profile?.email || "admin@gmail.com"}</span>
          </div>
          <div className="p-3.5 bg-warm-ivory/60 rounded-xl border border-espresso/15">
            <span className="text-espresso/60 block mb-1">Hak Akses:</span>
            <span className="inline-flex items-center gap-1 font-bold text-xs uppercase px-2 py-0.5 rounded bg-butter-yellow border border-espresso text-espresso">
              <ShieldCheck className="w-3 h-3" />
              <span>{profile?.role || "admin"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Formulir Ganti Password */}
      <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 sm:p-8 shadow-retro-md">
        <h2 className="font-display font-extrabold text-lg text-espresso mb-2 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-toasted-crust" />
          <span>Perbarui Kata Sandi</span>
        </h2>
        <p className="font-body text-xs text-espresso/70 mb-6">
          Masukkan kata sandi lama Anda saat ini untuk mengonfirmasi identitas, lalu buat kata sandi baru.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
              Password Saat Ini *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-warm-ivory/50 text-espresso px-4 py-2.5 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
              />
              <Lock className="absolute right-3 top-3 w-4 h-4 text-warm-grey" />
            </div>
            <p className="text-[11px] text-espresso/60 mt-1">
              (Jika belum pernah diubah, gunakan kata sandi default: <code>123456</code>)
            </p>
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
              Password Baru (min. 6 karakter) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-warm-ivory/50 text-espresso px-4 py-2.5 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
              />
              <Lock className="absolute right-3 top-3 w-4 h-4 text-warm-grey" />
            </div>
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
              Ulangi Password Baru *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-warm-ivory/50 text-espresso px-4 py-2.5 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
              />
              <Lock className="absolute right-3 top-3 w-4 h-4 text-warm-grey" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Password Baru</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
