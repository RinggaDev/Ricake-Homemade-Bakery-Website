"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Building2,
  QrCode,
} from "lucide-react";

interface OrderDetail {
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

export default function OrderTicketPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [paymentTab, setPaymentTab] = useState<"qris" | "transfer">("qris");

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Pesanan tidak ditemukan.");
        }
      } catch {
        setError("Gagal memuat detail tiket pesanan.");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [params.id]);

  const copyTicketCode = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.ticket_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyBankNumber = (accNo: string) => {
    navigator.clipboard.writeText(accNo);
    setCopiedBank(accNo);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-espresso mb-3" />
        <p className="font-body text-xs text-espresso/70">Memuat tiket pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-warm-ivory flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-600 mb-3" />
        <h1 className="font-display font-extrabold text-xl text-espresso mb-1">
          Tiket Tidak Ditemukan
        </h1>
        <p className="font-body text-xs text-espresso/70 mb-6 max-w-sm">
          {error || "Tiket pesanan tidak ditemukan atau Anda belum memiliki akses ke pesanan ini."}
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-butter-yellow border-2 border-espresso text-xs font-bold font-body shadow-retro-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  let itemsList: ParsedItem[] = [];
  try {
    itemsList = JSON.parse(order.items);
  } catch {
    itemsList = [];
  }

  const rawPhone = siteConfig.contact.whatsapp.replace(/[^0-9]/g, "");
  const waConfirmText = encodeURIComponent(
    `Halo Ricake Bakery, saya ingin konfirmasi pembayaran untuk Tiket Pesanan: ${order.ticket_code}\n` +
      `Atas Nama: ${order.customer_name}\n` +
      `Total: Rp ${order.total_amount.toLocaleString("id-ID")}\n\n` +
      `Berikut bukti transfer/scan QRIS saya. Mohon segera diproses. Terima kasih!`
  );
  const waUrl = `https://wa.me/${rawPhone}?text=${waConfirmText}`;

  return (
    <div className="min-h-screen bg-warm-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/portal/orders"
            className="inline-flex items-center gap-2 font-body text-xs font-bold text-toasted-crust hover:text-espresso transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lihat Semua Pesanan Saya</span>
          </Link>
          <Link href="/" className="font-display font-black text-lg text-espresso">
            Ricake Bakery
          </Link>
        </div>

        {/* Status Card Banner */}
        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 sm:p-7 shadow-retro-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-espresso/10 pb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-espresso/60 font-body">
                Tiket Pesanan Resmi
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-display font-black text-2xl text-espresso tracking-tight">
                  {order.ticket_code}
                </span>
                <button
                  onClick={copyTicketCode}
                  className="p-1 rounded hover:bg-warm-ivory text-espresso/60 hover:text-espresso transition-colors"
                  title="Salin Kode Tiket"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Badge Status */}
            <div>
              {order.status === "menunggu_konfirmasi" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-yellow-100 text-yellow-900 border border-yellow-300 shadow-retro-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Menunggu Konfirmasi</span>
                </span>
              )}
              {order.status === "dikonfirmasi" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-green-100 text-green-900 border border-green-300 shadow-retro-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                  <span>Pembayaran Dikonfirmasi</span>
                </span>
              )}
              {order.status === "dibatalkan" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-red-100 text-red-900 border border-red-300 shadow-retro-xs">
                  <XCircle className="w-3.5 h-3.5 text-red-700" />
                  <span>Dibatalkan</span>
                </span>
              )}
            </div>
          </div>

          {/* Status Message Info */}
          {order.status === "menunggu_konfirmasi" && (
            <div className="p-4 rounded-xl bg-butter-cream/60 border border-espresso/20 text-xs font-body text-espresso space-y-1">
              <p className="font-bold text-toasted-crust">
                Langkah Berikutnya: Selesaikan Pembayaran dengan Scan QRIS di bawah ini.
              </p>
              <p className="text-espresso/80 leading-relaxed">
                Setelah pembayaran selesai, kirim bukti bayar melalui tombol WhatsApp di bawah agar admin Ricake segera memproses pesanan kue Anda.
              </p>
            </div>
          )}

          {order.status === "dikonfirmasi" && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-300 text-xs font-body text-green-900 space-y-1">
              <p className="font-bold text-green-800">
                🎉 Selamat, pembayaran Anda telah dikonfirmasi!
              </p>
              <p className="leading-relaxed">
                Pesanan Anda sedang disiapkan dengan penuh kehangatan oleh dapur Ricake. Silakan tunggu informasi jadwal pengantaran atau pengambilan selanjutnya dari admin melalui email / WhatsApp.
              </p>
            </div>
          )}

          {order.status === "dibatalkan" && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-xs font-body text-red-900 space-y-1">
              <p className="font-bold text-red-800">Pesanan Dibatalkan</p>
              <p className="leading-relaxed">
                Alasan pembatalan: {order.cancel_reason || "Tidak ada alasan spesifik."}
              </p>
            </div>
          )}
        </div>

        {/* Card Metode Pembayaran (QRIS & Transfer Bank) */}
        {order.status === "menunggu_konfirmasi" && (
          <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 sm:p-8 shadow-retro-md space-y-6">
            <div className="text-center">
              <span className="font-body text-xs font-bold uppercase tracking-widest text-toasted-crust">
                Pilih Metode Pembayaran
              </span>
              <h2 className="font-display font-black text-2xl text-espresso mt-1">
                Selesaikan Pembayaran
              </h2>
              <p className="font-body text-xs text-espresso/70 mt-1 max-w-md mx-auto">
                Pilih antara Scan Barcode QRIS instan atau Transfer langsung ke Rekening Bank Resmi Ricake.
              </p>
            </div>

            {/* Total Amount Tag */}
            <div className="text-center">
              <div className="inline-block py-2.5 px-6 rounded-xl bg-butter-yellow border-2 border-espresso shadow-retro-xs">
                <span className="text-[11px] font-body font-semibold text-espresso/80 block">
                  Total yang Harus Dibayar:
                </span>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="font-display font-black text-2xl sm:text-3xl text-espresso">
                    Rp {order.total_amount.toLocaleString("id-ID")}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(order.total_amount));
                      setCopiedBank("amount");
                      setTimeout(() => setCopiedBank(null), 2000);
                    }}
                    title="Salin Nominal"
                    className="p-1 rounded hover:bg-butter-cream text-espresso/70 hover:text-espresso transition-colors"
                  >
                    {copiedBank === "amount" ? (
                      <Check className="w-4 h-4 text-green-700" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto p-1.5 rounded-xl bg-warm-ivory border border-espresso/30">
              <button
                type="button"
                onClick={() => setPaymentTab("qris")}
                className={`py-2 px-3 rounded-lg font-body text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentTab === "qris"
                    ? "bg-espresso text-paper-white shadow-retro-xs"
                    : "text-espresso/70 hover:text-espresso"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QRIS (Semua Bank &amp; e-Wallet)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab("transfer")}
                className={`py-2 px-3 rounded-lg font-body text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentTab === "transfer"
                    ? "bg-espresso text-paper-white shadow-retro-xs"
                    : "text-espresso/70 hover:text-espresso"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Transfer Bank / Rekening</span>
              </button>
            </div>

            {/* TAB CONTENT 1: QRIS */}
            {paymentTab === "qris" && (
              <div className="space-y-4 animate-fadeIn text-center">
                <div className="relative max-w-sm mx-auto aspect-[480/620] w-full rounded-2xl overflow-hidden shadow-retro-lg border-2 border-espresso bg-white">
                  <Image
                    src="/images/qris-ricake.svg"
                    alt="Barcode QRIS Ricake Bakery"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <p className="font-body text-xs text-espresso/70 max-w-sm mx-auto">
                  Scan barcode QRIS di atas menggunakan BCA Mobile, Livin' Mandiri, BRImo, BNI Mobile, GoPay, OVO, DANA, atau ShopeePay.
                </p>
              </div>
            )}

            {/* TAB CONTENT 2: TRANSFER BANK */}
            {paymentTab === "transfer" && (
              <div className="space-y-4 animate-fadeIn max-w-lg mx-auto">
                <p className="font-body text-xs text-espresso/80 text-center">
                  Silakan transfer tepat sebesar <strong>Rp {order.total_amount.toLocaleString("id-ID")}</strong> ke salah satu rekening bank resmi Ricake berikut:
                </p>

                <div className="space-y-3">
                  {siteConfig.bankAccounts.map((acc) => (
                    <div
                      key={acc.accountNumber}
                      className="p-4 rounded-xl border-2 border-espresso bg-warm-ivory/40 shadow-retro-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${acc.color}`}
                          >
                            {acc.logoText}
                          </span>
                          <span className="font-body text-xs font-bold text-espresso">
                            {acc.bankName}
                          </span>
                        </div>
                        <div className="font-mono font-black text-lg text-espresso tracking-wider">
                          {acc.accountNumber}
                        </div>
                        <div className="font-body text-[11px] text-espresso/70">
                          a.n. <strong className="text-espresso">{acc.accountHolder}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyBankNumber(acc.accountNumber)}
                        className="px-3 py-2 rounded-lg bg-paper-white border border-espresso font-body text-xs font-bold text-espresso hover:bg-butter-yellow transition-all shadow-retro-xs flex items-center gap-1.5 shrink-0"
                      >
                        {copiedBank === acc.accountNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-700" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-toasted-crust" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-warm-ivory border border-espresso/20 text-[11px] font-body text-espresso/80 space-y-1">
                  <div className="font-bold text-espresso">Panduan Transfer m-Banking:</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Pilih menu Transfer ke Rekening Bank.</li>
                    <li>Masukkan nomor rekening dan pastikan nama penerima adalah Ricake Bakery.</li>
                    <li>Ketik nominal tepat Rp {order.total_amount.toLocaleString("id-ID")}.</li>
                    <li>Simpan bukti transfer dan kirimkan via WhatsApp di bawah.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Action Kirim Bukti WhatsApp */}
            <div className="pt-2 max-w-md mx-auto space-y-2 text-center">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-butter-yellow text-espresso font-body text-sm font-bold border-2 border-espresso shadow-retro hover:bg-toasted-crust hover:text-paper-white transition-all active:translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 text-espresso group-hover:text-paper-white" />
                <span>Kirim Bukti Pembayaran ke WhatsApp</span>
              </a>
              <p className="font-body text-[11px] text-espresso/60">
                Otomatis membuka WhatsApp dengan detail tiket #{order.ticket_code}
              </p>
            </div>
          </div>
        )}

        {/* Detail Pesanan Items */}
        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-md space-y-4">
          <h3 className="font-display font-extrabold text-lg text-espresso flex items-center gap-2 border-b border-espresso/15 pb-3">
            <ShoppingBag className="w-4 h-4 text-toasted-crust" />
            <span>Rincian Menu Dipesan</span>
          </h3>

          <div className="divide-y divide-espresso/10">
            {itemsList.map((item, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-3 text-xs font-body">
                <div>
                  <div className="font-bold text-espresso text-sm">{item.product_name}</div>
                  {item.variant && (
                    <div className="text-toasted-crust font-medium text-[11px]">
                      Varian: {item.variant}
                    </div>
                  )}
                  <div className="text-espresso/60 mt-0.5">
                    {item.quantity} x Rp {item.unit_price.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="font-display font-bold text-sm text-espresso">
                  Rp {item.subtotal.toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t-2 border-espresso/15 flex justify-between items-baseline font-body">
            <span className="font-bold text-sm text-espresso">Total Pesanan:</span>
            <span className="font-display font-black text-xl text-espresso text-toasted-crust">
              Rp {order.total_amount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Detail Pengiriman & Catatan */}
        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-md space-y-3 font-body text-xs">
          <h3 className="font-display font-extrabold text-lg text-espresso flex items-center gap-2 border-b border-espresso/15 pb-3">
            <MapPin className="w-4 h-4 text-toasted-crust" />
            <span>Informasi Pengiriman</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-espresso/90">
            <div>
              <span className="text-espresso/60 block">Nama Penerima:</span>
              <span className="font-bold">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-espresso/60 block">WhatsApp:</span>
              <span className="font-mono font-bold">{order.customer_phone}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-espresso/60 block">Alamat / Takeaway:</span>
              <span className="font-medium leading-relaxed">{order.customer_address}</span>
            </div>
            {order.notes && (
              <div className="sm:col-span-2 p-2.5 rounded-lg bg-warm-ivory/60 border border-espresso/15">
                <span className="text-espresso/60 block text-[10px] uppercase font-bold">Catatan:</span>
                <span className="italic">{order.notes}</span>
              </div>
            )}
            <div className="sm:col-span-2 pt-2 border-t border-espresso/10 text-espresso/60 flex items-center gap-1.5 text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Waktu Pemesanan:{" "}
                {new Date(order.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
