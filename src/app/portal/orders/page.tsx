"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  PlusCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface OrderTicket {
  id: string;
  ticket_code: string;
  total_amount: number;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  created_at: string;
  items: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMyOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setError(data.error || "Gagal memuat pesanan.");
        }
      } catch {
        setError("Terjadi kesalahan jaringan.");
      } finally {
        setLoading(false);
      }
    }
    loadMyOrders();
  }, []);

  return (
    <div className="min-h-screen bg-warm-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 font-body text-xs font-bold text-toasted-crust hover:text-espresso transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Portal</span>
          </Link>
          <Link
            href="/order"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-xs hover:bg-toasted-crust hover:text-paper-white transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Pesan Menu Baru</span>
          </Link>
        </div>

        <div>
          <h1 className="font-display font-black text-3xl text-espresso tracking-tight">
            Pesanan Saya
          </h1>
          <p className="font-body text-xs sm:text-sm text-espresso/70 mt-1">
            Pantau status verifikasi pembayaran QRIS dan kesiapan pesanan kue Ricake Anda.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-espresso mb-2" />
            <p className="font-body text-xs text-espresso/70">Memuat riwayat tiket...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-paper-white border-2 border-espresso rounded-2xl p-12 text-center shadow-retro-sm">
            <ShoppingBag className="w-12 h-12 text-espresso/30 mx-auto mb-3" />
            <h2 className="font-display font-extrabold text-lg text-espresso mb-1">
              Belum Ada Pesanan
            </h2>
            <p className="font-body text-xs text-espresso/70 mb-5 max-w-sm mx-auto">
              Anda belum memiliki tiket pesanan. Pesan Churros Frozen, Custom Bolu, atau cookies sekarang juga!
            </p>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all"
            >
              <span>Mulai Pesan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => {
              let parsedItemsCount = 1;
              try {
                parsedItemsCount = JSON.parse(ord.items).length;
              } catch {
                parsedItemsCount = 1;
              }

              return (
                <div
                  key={ord.id}
                  className="bg-paper-white border-2 border-espresso rounded-2xl p-5 shadow-retro-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-retro-md transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-lg text-espresso">
                        {ord.ticket_code}
                      </span>
                      {ord.status === "menunggu_konfirmasi" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-900 border border-yellow-300">
                          <Clock className="w-3 h-3" />
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

                    <div className="font-body text-xs text-espresso/70 flex items-center gap-3">
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
                      <span>{parsedItemsCount} jenis menu</span>
                    </div>

                    <div className="font-display font-extrabold text-base text-toasted-crust pt-1">
                      Rp {ord.total_amount.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <Link
                    href={`/order/${ord.id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-warm-ivory text-espresso font-body text-xs font-bold border border-espresso hover:bg-butter-yellow transition-all shadow-retro-xs shrink-0"
                  >
                    <span>Buka Tiket / QRIS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
