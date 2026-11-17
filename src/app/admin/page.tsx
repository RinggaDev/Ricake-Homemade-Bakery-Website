"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Newspaper,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  FileText,
  Clock,
  Loader2,
  ShoppingBag,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  publishedNews: number;
  draftNews: number;
  totalRoles: number;
  pendingOrders: number;
  totalOrders: number;
  recentNews: any[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    publishedNews: 0,
    draftNews: 0,
    totalRoles: 0,
    pendingOrders: 0,
    totalOrders: 0,
    recentNews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersRes, rolesRes, newsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/roles"),
          fetch("/api/admin/news"),
          fetch("/api/admin/orders"),
        ]);

        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();
        const newsData = await newsRes.json();
        const ordersData = await ordersRes.json();

        const newsList = newsData.news || [];
        const publishedCount = newsList.filter((n: any) => n.status === "published").length;
        const draftCount = newsList.filter((n: any) => n.status === "draft").length;

        const orderList = ordersData.orders || [];
        const pendingOrderCount = orderList.filter((o: any) => o.status === "menunggu_konfirmasi").length;

        setStats({
          totalUsers: (usersData.users || []).length,
          publishedNews: publishedCount,
          draftNews: draftCount,
          totalRoles: (rolesData.roles || []).length,
          pendingOrders: pendingOrderCount,
          totalOrders: orderList.length,
          recentNews: newsList.slice(0, 4),
        });
      } catch (err) {
        console.error("Gagal memuat statistik admin", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-espresso mb-3" />
        <p className="font-body text-xs text-espresso/70">Menyiapkan ringkasan dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-espresso tracking-tight">
            Ringkasan Dapur Ricake
          </h1>
          <p className="font-body text-xs sm:text-sm text-espresso/70 mt-1">
            Pantau status pengguna, publikasi berita, dan database Google Spreadsheet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </Link>
        </div>
      </div>

      {/* Peringatan Keamanan Kredensial Awal (Wajib sesuai ketentuan Skill) */}
      <div className="bg-butter-cream border-2 border-dashed border-toasted-crust rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-toasted-crust text-paper-white shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-sm text-espresso">
            Perhatian Keamanan: Akun Default Awal
          </h2>
          <p className="font-body text-xs text-espresso/80 leading-relaxed">
            Akun administrator saat ini dibuat menggunakan email <code className="font-bold text-espresso bg-warm-ivory px-1.5 py-0.5 rounded border border-espresso/20">admin@gmail.com</code> dan password standar <code className="font-bold text-espresso bg-warm-ivory px-1.5 py-0.5 rounded border border-espresso/20">123456</code>. Sebelum mempublikasikan website ke domain publik, pastikan untuk segera mengganti password di menu{" "}
            <Link href="/admin/profile" className="font-bold text-toasted-crust hover:underline">
              Profil & Keamanan
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Metrik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card Pesanan QRIS */}
        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-xs font-bold uppercase tracking-wider text-espresso/70">
              Pesanan QRIS
            </span>
            <div className="w-8 h-8 rounded-lg bg-butter-yellow border border-espresso/30 flex items-center justify-center text-espresso">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-3xl text-espresso">
              {stats.totalOrders}
            </div>
            {stats.pendingOrders > 0 && (
              <span className="inline-block mt-1 text-[11px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded border border-yellow-300">
                {stats.pendingOrders} menunggu verifikasi
              </span>
            )}
          </div>
          <Link
            href="/admin/orders"
            className="mt-3 inline-flex items-center gap-1 font-body text-xs font-bold text-toasted-crust hover:text-espresso"
          >
            <span>Buka tiket pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-xs font-bold uppercase tracking-wider text-espresso/70">
              Total Pengguna
            </span>
            <div className="w-8 h-8 rounded-lg bg-warm-ivory border border-espresso/30 flex items-center justify-center text-espresso">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-espresso">
            {stats.totalUsers}
          </div>
          <Link
            href="/admin/users"
            className="mt-3 inline-flex items-center gap-1 font-body text-xs font-bold text-toasted-crust hover:text-espresso"
          >
            <span>Kelola pengguna</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-xs font-bold uppercase tracking-wider text-espresso/70">
              Berita Publik
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-300 flex items-center justify-center text-green-700">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-espresso">
            {stats.publishedNews}
          </div>
          <Link
            href="/admin/news?status=published"
            className="mt-3 inline-flex items-center gap-1 font-body text-xs font-bold text-toasted-crust hover:text-espresso"
          >
            <span>Lihat artikel rilis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-xs font-bold uppercase tracking-wider text-espresso/70">
              Peran Akun
            </span>
            <div className="w-8 h-8 rounded-lg bg-butter-yellow/60 border border-espresso/30 flex items-center justify-center text-espresso">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-espresso">
            {stats.totalRoles}
          </div>
          <Link
            href="/admin/roles"
            className="mt-3 inline-flex items-center gap-1 font-body text-xs font-bold text-toasted-crust hover:text-espresso"
          >
            <span>Kelola peran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tabel Berita Terkini */}
      <div className="bg-paper-white border-2 border-espresso rounded-2xl shadow-retro-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-toasted-crust" />
            <h2 className="font-display font-extrabold text-lg text-espresso">
              Artikel Berita Terakhir
            </h2>
          </div>
          <Link
            href="/admin/news"
            className="font-body text-xs font-bold text-toasted-crust hover:text-espresso hover:underline"
          >
            Buka Semua Berita →
          </Link>
        </div>

        {stats.recentNews.length === 0 ? (
          <div className="py-8 text-center text-espresso/60 font-body text-xs">
            Belum ada berita yang tersimpan. Klik "Tulis Berita Baru" untuk menambahkan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs">
              <thead>
                <tr className="border-b-2 border-espresso/15 text-espresso/60 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Judul Berita</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Dibuat Pada</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10">
                {stats.recentNews.map((item) => (
                  <tr key={item.id} className="hover:bg-warm-ivory/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-espresso max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          item.status === "published"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-yellow-100 text-yellow-800 border-yellow-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-espresso/70">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/admin/news"
                        className="font-bold text-toasted-crust hover:text-espresso underline"
                      >
                        Kelola
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
