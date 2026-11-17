"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  Loader2,
  AlertCircle,
  Eye,
  Check,
  X,
  MapPin,
  Phone,
  User,
} from "lucide-react";

interface AdminOrder {
  id: string;
  ticket_code: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  total_amount: number;
  notes: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  cancel_reason?: string;
  created_at: string;
}

interface ParsedItem {
  product_id: string;
  product_name: string;
  variant?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal Detail & Aksi
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memuat daftar pesanan." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    nextStatus: "dikonfirmasi" | "dibatalkan",
    reason?: string
  ) => {
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: nextStatus,
          cancel_reason: reason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah status pesanan." });
        setActionLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: `Pesanan berhasil diubah menjadi "${nextStatus}".`,
      });

      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus, cancel_reason: reason } : null));
      }
      setCancelModalOrder(null);
      setCancelReason("");
      await fetchOrders();
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan koneksi saat memperbarui pesanan." });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const phoneStr = String(o.customer_phone || "");
    const matchSearch =
      (o.ticket_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      phoneStr.includes(search);

    if (filterStatus === "all") return matchSearch;
    return matchSearch && o.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-espresso tracking-tight">
            Manajemen Tiket Pesanan &amp; QRIS
          </h1>
          <p className="font-body text-xs sm:text-sm text-espresso/70 mt-1">
            Konfirmasi pembayaran masuk dari QRIS, tinjau alamat pengiriman, dan hubungi pelanggan.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-body font-medium flex items-center gap-2.5 animate-fadeIn ${
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

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all shrink-0 ${
              filterStatus === "all"
                ? "bg-espresso text-paper-white shadow-retro-xs"
                : "bg-paper-white text-espresso border border-espresso/30 hover:bg-warm-ivory"
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus("menunggu_konfirmasi")}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all shrink-0 ${
              filterStatus === "menunggu_konfirmasi"
                ? "bg-espresso text-paper-white shadow-retro-xs"
                : "bg-paper-white text-espresso border border-espresso/30 hover:bg-warm-ivory"
            }`}
          >
            Menunggu ({orders.filter((o) => o.status === "menunggu_konfirmasi").length})
          </button>
          <button
            onClick={() => setFilterStatus("dikonfirmasi")}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all shrink-0 ${
              filterStatus === "dikonfirmasi"
                ? "bg-espresso text-paper-white shadow-retro-xs"
                : "bg-paper-white text-espresso border border-espresso/30 hover:bg-warm-ivory"
            }`}
          >
            Dikonfirmasi ({orders.filter((o) => o.status === "dikonfirmasi").length})
          </button>
          <button
            onClick={() => setFilterStatus("dibatalkan")}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all shrink-0 ${
              filterStatus === "dibatalkan"
                ? "bg-espresso text-paper-white shadow-retro-xs"
                : "bg-paper-white text-espresso border border-espresso/30 hover:bg-warm-ivory"
            }`}
          >
            Dibatalkan ({orders.filter((o) => o.status === "dibatalkan").length})
          </button>
        </div>

        {/* Search */}
        <div className="bg-paper-white border-2 border-espresso rounded-xl px-3 py-1.5 shadow-retro-xs flex items-center gap-2 w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-warm-grey shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode tiket / nama / WA..."
            className="w-full bg-transparent font-body text-xs text-espresso focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-paper-white border-2 border-espresso rounded-2xl shadow-retro-md overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-espresso mb-2" />
            <p className="font-body text-xs text-espresso/70">Memuat data pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-espresso/60 font-body text-xs">
            {search ? "Tidak ada pesanan yang sesuai dengan kata kunci." : "Belum ada pesanan masuk."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs">
              <thead>
                <tr className="bg-warm-ivory border-b-2 border-espresso text-espresso uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Tiket</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status QRIS</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10">
                {filteredOrders.map((ord) => {
                  const phoneStr = String(ord.customer_phone || "");
                  const rawPhone = phoneStr.replace(/[^0-9]/g, "");
                  const cleanPhone = rawPhone.startsWith("0") ? "62" + rawPhone.slice(1) : rawPhone;
                  const waConfirmUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Halo Kak ${ord.customer_name}, terima kasih sudah memesan di Ricake! Pembayaran untuk Tiket #${ord.ticket_code} (Rp ${ord.total_amount.toLocaleString("id-ID")}) telah kami terima dan pesanan sedang disiapkan dapur kami.`
                  )}`;

                  return (
                    <tr key={ord.id} className="hover:bg-warm-ivory/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-espresso">
                        {ord.ticket_code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-espresso">{ord.customer_name}</div>
                        <div className="font-mono text-[11px] text-espresso/60">{ord.customer_phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-display font-extrabold text-sm text-espresso">
                        Rp {ord.total_amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.status === "menunggu_konfirmasi" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-900 border border-yellow-300">
                            <Clock className="w-3 h-3" />
                            <span>Menunggu</span>
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
                      </td>
                      <td className="py-3.5 px-4 text-espresso/70 text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail Modal */}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            title="Lihat Detail Pesanan"
                            className="p-1.5 rounded-lg bg-warm-ivory border border-espresso/30 text-espresso hover:bg-butter-yellow transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Tombol Cepat Konfirmasi */}
                          {ord.status === "menunggu_konfirmasi" && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, "dikonfirmasi")}
                              disabled={actionLoading}
                              title="Konfirmasi Pembayaran QRIS"
                              className="p-1.5 rounded-lg bg-green-50 border border-green-300 text-green-700 hover:bg-green-100 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Tombol Batalkan */}
                          {ord.status !== "dibatalkan" && (
                            <button
                              onClick={() => setCancelModalOrder(ord)}
                              disabled={actionLoading}
                              title="Batalkan Pesanan"
                              className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Tombol Hubungi WhatsApp */}
                          <a
                            href={waConfirmUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Hubungi via WhatsApp"
                            className="p-1.5 rounded-lg bg-green-600 text-paper-white border border-espresso hover:bg-green-700 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-paper-white w-full max-w-lg rounded-2xl border-2 border-espresso shadow-retro-xl p-6 sm:p-7 relative my-8">
            <div className="flex items-start justify-between border-b border-espresso/15 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-toasted-crust font-body">
                  Rincian Tiket Masuk
                </span>
                <h3 className="font-display font-black text-2xl text-espresso">
                  {selectedOrder.ticket_code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg bg-warm-ivory border border-espresso/30 text-espresso hover:bg-butter-yellow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 font-body text-xs">
              {/* Status & Total */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-warm-ivory/60 border border-espresso/20">
                <div>
                  <span className="text-espresso/60 text-[10px] block uppercase font-bold">Status:</span>
                  <span className="font-bold uppercase text-xs">
                    {selectedOrder.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-espresso/60 text-[10px] block uppercase font-bold">Total:</span>
                  <span className="font-display font-black text-lg text-toasted-crust">
                    Rp {selectedOrder.total_amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Data Pelanggan */}
              <div className="space-y-2 p-3 rounded-xl border border-espresso/15 bg-paper-white">
                <div className="flex items-center gap-2 text-espresso font-bold">
                  <User className="w-3.5 h-3.5 text-toasted-crust" />
                  <span>{selectedOrder.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-espresso/80 font-mono">
                  <Phone className="w-3.5 h-3.5 text-toasted-crust" />
                  <span>{selectedOrder.customer_phone}</span>
                </div>
                <div className="flex items-start gap-2 text-espresso/80">
                  <MapPin className="w-3.5 h-3.5 text-toasted-crust shrink-0 mt-0.5" />
                  <span>{selectedOrder.customer_address}</span>
                </div>
                {selectedOrder.notes && (
                  <div className="pt-2 border-t border-espresso/10 text-espresso/70 italic">
                    Catatan: "{selectedOrder.notes}"
                  </div>
                )}
              </div>

              {/* Rincian Menu */}
              <div>
                <span className="font-bold text-espresso uppercase text-[11px] block mb-2">
                  Item yang Dipesan:
                </span>
                <div className="space-y-1.5">
                  {(() => {
                    let items: ParsedItem[] = [];
                    try {
                      items = JSON.parse(selectedOrder.items);
                    } catch {
                      items = [];
                    }
                    return items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-warm-ivory/40 border border-espresso/10"
                      >
                        <div>
                          <div className="font-bold text-espresso">{it.product_name}</div>
                          {it.variant && (
                            <div className="text-[10px] text-toasted-crust">{it.variant}</div>
                          )}
                          <div className="text-[10px] text-espresso/60">
                            {it.quantity} x Rp {it.unit_price.toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div className="font-bold text-espresso">
                          Rp {it.subtotal.toLocaleString("id-ID")}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-espresso/15 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {selectedOrder.status === "menunggu_konfirmasi" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "dikonfirmasi")}
                      disabled={actionLoading}
                      className="px-3.5 py-2 rounded-xl bg-green-600 text-paper-white font-body text-xs font-bold border border-espresso hover:bg-green-700 shadow-retro-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Konfirmasi Pembayaran</span>
                    </button>
                  )}
                  {selectedOrder.status !== "dibatalkan" && (
                    <button
                      onClick={() => {
                        setCancelModalOrder(selectedOrder);
                        setSelectedOrder(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-red-50 text-red-700 font-body text-xs font-bold border border-red-300 hover:bg-red-100"
                    >
                      Tolak / Batalkan
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-espresso hover:bg-warm-ivory"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Batalkan Pesanan */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-white w-full max-w-sm rounded-2xl border-2 border-espresso shadow-retro-xl p-6">
            <h3 className="font-display font-extrabold text-lg text-red-700 mb-1">
              Batalkan Pesanan {cancelModalOrder.ticket_code}
            </h3>
            <p className="font-body text-xs text-espresso/70 mb-4">
              Tuliskan alasan pembatalan agar customer dapat melihat alasannya di tiket pesanan mereka.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateStatus(cancelModalOrder.id, "dibatalkan", cancelReason);
              }}
              className="space-y-3"
            >
              <textarea
                rows={3}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Contoh: Stok bahan habis, atau bukti transfer belum masuk setelah 1x24 jam"
                className="w-full bg-warm-ivory/50 text-espresso px-3 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-espresso hover:bg-warm-ivory"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 rounded-lg bg-red-600 text-paper-white font-body text-xs font-bold border border-espresso shadow-retro-xs hover:bg-red-700 flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Konfirmasi Pembatalan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
