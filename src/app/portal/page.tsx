"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  User,
  ShoppingBag,
  KeyRound,
  LogOut,
  Shield,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Phone,
  Receipt,
  Cake,
  Cookie,
  Flame,
  ChevronRight,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface OrderItemParsed {
  product_id?: string;
  product_name: string;
  variant?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderTicket {
  id: string;
  ticket_code: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  total_amount: number;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  created_at: string;
}

export default function CustomerPortalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // State untuk form ganti password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const resUser = await fetch("/api/auth/me");
        const dataUser = await resUser.json();
        if (dataUser.success && dataUser.user) {
          setProfile(dataUser.user);
          setLoading(false);

          // Muat pesanan pelanggan
          try {
            const resOrders = await fetch("/api/orders");
            const dataOrders = await resOrders.json();
            if (dataOrders.success) {
              setOrders(dataOrders.orders || []);
            }
          } catch {
            // Ignore orders fetch error gracefully
          } finally {
            setOrdersLoading(false);
          }
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);

    if (newPassword !== confirmPassword) {
      setPwMessage({ type: "error", text: "Konfirmasi password baru tidak cocok." });
      return;
    }

    if (newPassword.length < 6) {
      setPwMessage({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwMessage({ type: "error", text: data.error || "Gagal mengubah password." });
        setPwLoading(false);
        return;
      }

      setPwMessage({ type: "success", text: "Password berhasil diperbarui!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPwMessage(null);
      }, 1500);
    } catch {
      setPwMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-espresso mb-3" />
        <p className="font-body text-sm text-espresso/70">Memuat portal akun Ricake...</p>
      </div>
    );
  }

  // Ringkasan metrik pesanan pelanggan
  const pendingOrders = orders.filter((o) => o.status === "menunggu_konfirmasi");
  const confirmedOrders = orders.filter((o) => o.status === "dikonfirmasi");
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-warm-ivory flex flex-col">
      {/* Top Navbar */}
      <header className="bg-paper-white border-b-2 border-espresso sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 relative overflow-hidden rounded-md bg-paper-white border border-espresso flex items-center justify-center shadow-retro-sm">
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-display font-extrabold text-xl text-espresso flex items-center gap-2">
              Ricake{" "}
              <span className="font-body text-[11px] font-bold px-2 py-0.5 rounded-full bg-butter-yellow border border-espresso text-espresso">
                Portal Pelanggan
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* User tag */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warm-ivory border border-espresso/20 text-xs font-body font-bold text-espresso">
              <span className="truncate max-w-[120px]">{profile?.name}</span>
              <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-espresso text-paper-white font-extrabold tracking-wider">
                {profile?.role}
              </span>
            </div>

            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-toasted-crust text-paper-white font-body text-xs font-bold border border-espresso hover:bg-espresso transition-colors shadow-retro-sm"
              >
                <Shield className="w-3.5 h-3.5 text-butter-yellow" />
                <span className="hidden sm:inline">Dashboard Admin</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-white text-espresso font-body text-xs font-bold border border-espresso/40 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Hero Card */}
        <div className="bg-paper-white border-2 border-espresso rounded-3xl p-6 sm:p-8 shadow-retro-lg relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-butter-yellow/40 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-butter-cream border border-espresso/20 text-xs font-bold text-toasted-crust">
                <Sparkles className="w-3.5 h-3.5 text-toasted-crust" />
                <span>Pelanggan Resmi Ricake Bakery</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-espresso tracking-tight">
                Selamat Datang, {profile?.name}! 👋
              </h1>
              <p className="font-body text-xs sm:text-sm text-espresso/80 max-w-xl leading-relaxed">
                Pantau tiket pesanan churros dan kue Anda, cek konfirmasi pembayaran QRIS/Bank Transfer, atau pesan menu lezat berikutnya langsung dari portal ini.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-black border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pesan Menu Baru</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-warm-ivory text-espresso font-body text-xs font-bold border border-espresso hover:bg-butter-cream transition-colors shadow-retro-xs"
              >
                <KeyRound className="w-3.5 h-3.5 text-toasted-crust" />
                <span>Ubah Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customer Quick Stats / Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex items-center justify-between">
            <div>
              <p className="font-body text-xs font-bold text-espresso/60 uppercase tracking-wider">
                Total Pesanan Saya
              </p>
              <p className="font-display font-black text-2xl sm:text-3xl text-espresso mt-1">
                {ordersLoading ? "..." : orders.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warm-ivory border-2 border-espresso flex items-center justify-center">
              <Receipt className="w-6 h-6 text-espresso" />
            </div>
          </div>

          <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex items-center justify-between">
            <div>
              <p className="font-body text-xs font-bold text-espresso/60 uppercase tracking-wider">
                Menunggu Konfirmasi
              </p>
              <p className="font-display font-black text-2xl sm:text-3xl text-yellow-700 mt-1">
                {ordersLoading ? "..." : pendingOrders.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-100 border-2 border-espresso flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-800" />
            </div>
          </div>

          <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex items-center justify-between">
            <div>
              <p className="font-body text-xs font-bold text-espresso/60 uppercase tracking-wider">
                Pesanan Dikonfirmasi
              </p>
              <p className="font-display font-black text-2xl sm:text-3xl text-green-700 mt-1">
                {ordersLoading ? "..." : confirmedOrders.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 border-2 border-espresso flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-800" />
            </div>
          </div>
        </div>

        {/* Live Orders Section */}
        <section className="bg-paper-white border-2 border-espresso rounded-3xl p-6 sm:p-8 shadow-retro-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/15 pb-5">
            <div>
              <h2 className="font-display font-black text-xl text-espresso flex items-center gap-2">
                <Receipt className="w-5 h-5 text-toasted-crust" />
                <span>Pesanan &amp; Tiket Terkini</span>
              </h2>
              <p className="font-body text-xs text-espresso/70 mt-0.5">
                Status verifikasi pembayaran QRIS dan kesiapan menu pesanan Anda di dapur Ricake.
              </p>
            </div>
            <Link
              href="/portal/orders"
              className="inline-flex items-center gap-1.5 font-body text-xs font-bold text-toasted-crust hover:text-espresso transition-colors"
            >
              <span>Lihat Semua Tiket ({orders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-espresso/60">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="font-body text-xs">Mengambil data tiket pesanan Anda...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-warm-ivory/60 border border-dashed border-espresso/30 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-butter-yellow border border-espresso mx-auto flex items-center justify-center text-espresso">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-display font-extrabold text-base text-espresso">
                Belum Ada Tiket Pesanan Aktif
              </h3>
              <p className="font-body text-xs text-espresso/70 max-w-md mx-auto">
                Yuk manjakan harimu dengan Churros Frozen khas Citayam yang renyah atau aneka Bolu &amp; Brownies lembut dari Ricake!
              </p>
              <div className="pt-2">
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-xs hover:bg-toasted-crust hover:text-paper-white transition-all"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((ord) => {
                let parsedItems: OrderItemParsed[] = [];
                try {
                  parsedItems = JSON.parse(ord.items);
                } catch {
                  parsedItems = [];
                }

                return (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl bg-warm-ivory/40 border-2 border-espresso/20 hover:border-espresso hover:bg-warm-ivory transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-display font-black text-base text-espresso">
                          #{ord.ticket_code}
                        </span>

                        {ord.status === "menunggu_konfirmasi" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-900 border border-yellow-300">
                            <Clock className="w-3 h-3 text-yellow-800" />
                            <span>Menunggu Konfirmasi</span>
                          </span>
                        )}
                        {ord.status === "dikonfirmasi" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-900 border border-green-300">
                            <CheckCircle2 className="w-3 h-3 text-green-700" />
                            <span>Dikonfirmasi</span>
                          </span>
                        )}
                        {ord.status === "dibatalkan" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-900 border border-red-300">
                            <XCircle className="w-3 h-3 text-red-700" />
                            <span>Dibatalkan</span>
                          </span>
                        )}
                      </div>

                      {/* Items preview text */}
                      <p className="font-body text-xs text-espresso/80 line-clamp-1">
                        {parsedItems.length > 0
                          ? parsedItems
                              .map(
                                (it) =>
                                  `${it.product_name} (${it.quantity}x${
                                    it.variant ? ` - ${it.variant}` : ""
                                  })`
                              )
                              .join(", ")
                          : "1 Pesanan Menu Ricake"}
                      </p>

                      <div className="font-body text-[11px] text-espresso/60 flex items-center gap-2">
                        <span>
                          {new Date(ord.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-toasted-crust font-display">
                          Rp {ord.total_amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/order/${ord.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border border-espresso hover:bg-toasted-crust hover:text-paper-white transition-all shadow-retro-xs shrink-0"
                    >
                      <span>Buka Tiket / QRIS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Favorite Menus & Shortcuts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-xl text-espresso flex items-center gap-2">
                <Flame className="w-5 h-5 text-toasted-crust" />
                <span>Menu Andalan Ricake</span>
              </h2>
              <p className="font-body text-xs text-espresso/70 mt-0.5">
                Pilih menu favorit dan nikmati kelezatan homemade hangat di rumah.
              </p>
            </div>
            <Link
              href="/order"
              className="inline-flex items-center gap-1 font-body text-xs font-bold text-toasted-crust hover:text-espresso transition-colors"
            >
              <span>Formulir Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Menu 1 */}
            <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-butter-yellow border border-espresso flex items-center justify-center mb-3">
                  <Flame className="w-5 h-5 text-espresso" />
                </div>
                <h3 className="font-display font-extrabold text-base text-espresso">
                  Churros Frozen Citayam
                </h3>
                <p className="font-body text-xs text-espresso/75 mt-1 leading-relaxed">
                  Tersedia varian Mentah Siap Goreng (praktis di freezer) dan varian Siap Saji lengkap dengan saus cokelat lumer.
                </p>
                <p className="font-display font-bold text-xs text-toasted-crust mt-2">
                  Mulai Rp 20.000 / pack
                </p>
              </div>
              <Link
                href="/order"
                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-warm-ivory text-espresso font-body text-xs font-bold border border-espresso hover:bg-butter-yellow transition-all"
              >
                <span>Pesan Churros</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Menu 2 */}
            <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-butter-cream border border-espresso flex items-center justify-center mb-3">
                  <Cake className="w-5 h-5 text-toasted-crust" />
                </div>
                <h3 className="font-display font-extrabold text-base text-espresso">
                  Custom Bolu &amp; Fudgy Brownies
                </h3>
                <p className="font-body text-xs text-espresso/75 mt-1 leading-relaxed">
                  Bolu keju melimpah, bolu pisang wangi, serta fudgy brownies dengan crust berkilau untuk segala momen manis.
                </p>
                <p className="font-display font-bold text-xs text-toasted-crust mt-2">
                  Mulai Rp 45.000
                </p>
              </div>
              <Link
                href="/order"
                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-warm-ivory text-espresso font-body text-xs font-bold border border-espresso hover:bg-butter-yellow transition-all"
              >
                <span>Pesan Bolu / Brownies</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Menu 3 */}
            <div className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-warm-ivory border border-espresso flex items-center justify-center mb-3">
                  <Cookie className="w-5 h-5 text-toasted-crust" />
                </div>
                <h3 className="font-display font-extrabold text-base text-espresso">
                  Artisan Soft Cookies
                </h3>
                <p className="font-body text-xs text-espresso/75 mt-1 leading-relaxed">
                  Tekstur renyah di luar, gooey dan lembut di dalam dengan lelehan cokelat premium Belgia.
                </p>
                <p className="font-display font-bold text-xs text-toasted-crust mt-2">
                  Mulai Rp 15.000 / pcs
                </p>
              </div>
              <Link
                href="/order"
                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-warm-ivory text-espresso font-body text-xs font-bold border border-espresso hover:bg-butter-yellow transition-all"
              >
                <span>Pesan Soft Cookies</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Profile Info & Support Bar */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detail Akun */}
          <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warm-ivory border border-espresso flex items-center justify-center text-espresso">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-espresso">
                  Informasi Akun
                </h3>
                <p className="font-body text-xs text-espresso/60">
                  Data diri yang tersimpan pada sistem Ricake.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 font-body text-xs text-espresso pt-2">
              <div className="flex justify-between py-1.5 border-b border-espresso/10">
                <span className="text-espresso/60">Nama Pelanggan:</span>
                <span className="font-bold">{profile?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-espresso/10">
                <span className="text-espresso/60">Email Terdaftar:</span>
                <span className="font-mono text-xs">{profile?.email}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-espresso/60">Peran Akun:</span>
                <span className="uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-butter-yellow border border-espresso text-espresso">
                  {profile?.role}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center gap-1.5 font-body text-xs font-bold text-toasted-crust hover:text-espresso transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Ganti kata sandi akun</span>
              </button>
            </div>
          </div>

          {/* Dapur Ricake Customer Service */}
          <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-butter-yellow border border-espresso flex items-center justify-center text-espresso">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-espresso">
                    Dapur &amp; Layanan Pelanggan
                  </h3>
                  <p className="font-body text-xs text-espresso/60">
                    Citayam, Depok • Jam Operasional 08.00 - 17.00 WIB
                  </p>
                </div>
              </div>

              <p className="font-body text-xs text-espresso/80 leading-relaxed">
                Butuh pesanan kustom dalam jumlah banyak untuk acara kantor, arisan, atau ulang tahun? Tim dapur Ricake siap membantu Anda via WhatsApp.
              </p>
            </div>

            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Halo Dapur Ricake, saya ${profile?.name || "pelanggan"}. Saya ingin konsultasi ketersediaan menu dan pesanan kustom.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-paper-white font-body text-xs font-bold border-2 border-espresso transition-all shadow-retro-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Dapur via WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* Modal Ubah Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-white w-full max-w-md rounded-2xl border-2 border-espresso shadow-retro-xl p-6 sm:p-8 relative">
            <h3 className="font-display font-extrabold text-2xl text-espresso mb-2">
              Ubah Password
            </h3>
            <p className="font-body text-xs text-espresso/80 mb-5">
              Masukkan password lama dan tentukan password baru yang aman.
            </p>

            {pwMessage && (
              <div
                className={`p-3 rounded-lg mb-4 text-xs font-medium flex items-center gap-2 ${
                  pwMessage.type === "success"
                    ? "bg-green-50 border border-green-300 text-green-800"
                    : "bg-red-50 border border-red-300 text-red-800"
                }`}
              >
                {pwMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{pwMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Password Lama
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-warm-ivory/50 text-espresso px-4 py-2 rounded-lg border border-espresso/30 text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Password Baru (min. 6 karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-warm-ivory/50 text-espresso px-4 py-2 rounded-lg border border-espresso/30 text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Ulangi Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-warm-ivory/50 text-espresso px-4 py-2 rounded-lg border border-espresso/30 text-sm focus:outline-none focus:ring-2 focus:ring-butter-yellow font-body"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={pwLoading}
                  className="px-4 py-2 rounded-lg text-espresso font-body text-xs font-bold hover:bg-warm-ivory transition-colors border border-transparent"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="px-4 py-2 rounded-lg bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all flex items-center gap-2"
                >
                  {pwLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
