"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

interface ProductCatalog {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  variants?: string[];
}

const CATALOG: ProductCatalog[] = [
  {
    id: "prod-churros",
    name: "Churros Frozen (2 Box Pack)",
    category: "Signature Frozen",
    price: 25000,
    unit: "2 box (10 pcs + 2 saus)",
    image: "/images/products/churros.jpg",
    variants: [
      "Saus Cokelat Leleh",
      "Saus Matcha Latte",
      "Saus Tiramisu",
      "Saus Keju Manis",
      "Saus Strawberry Glaze",
      "Saus Karamel Gurih",
    ],
  },
  {
    id: "prod-bolu",
    name: "Custom Bolu Homemade",
    category: "Classic Cake",
    price: 45000,
    unit: "1 loyang (diameter 18cm)",
    image: "/images/products/bolu.jpg",
    variants: [
      "Bolu Keju Melimpah",
      "Bolu Pisang Wangi",
      "Bolu Cokelat Lembut",
    ],
  },
  {
    id: "prod-brownies",
    name: "Fudgy Chocolate Brownies",
    category: "Rich Dessert",
    price: 35000,
    unit: "1 box (isi 9 potong)",
    image: "/images/products/brownies.jpg",
  },
  {
    id: "prod-cookies",
    name: "Artisan Soft Cookies",
    category: "Snack & Treats",
    price: 15000,
    unit: "1 pouch (isi 3 pcs jumbo)",
    image: "/images/products/cookies.jpg",
  },
];

interface SelectedCartItem {
  product: ProductCatalog;
  variant?: string;
  quantity: number;
}

export default function OrderPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Cart selection state
  const [cart, setCart] = useState<{ [productId: string]: SelectedCartItem }>({
    "prod-churros": {
      product: CATALOG[0],
      variant: CATALOG[0].variants?.[0],
      quantity: 1,
    },
  });

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.user) {
          setUser(data.user);
          setCustomerName(data.user.name || "");
        }
      })
      .finally(() => setAuthChecked(true));
  }, []);

  const toggleProduct = (prod: ProductCatalog) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[prod.id]) {
        delete copy[prod.id];
      } else {
        copy[prod.id] = {
          product: prod,
          variant: prod.variants ? prod.variants[0] : undefined,
          quantity: 1,
        };
      }
      return copy;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      const nextQty = item.quantity + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: { ...item, quantity: nextQty },
      };
    });
  };

  const updateVariant = (productId: string, variant: string) => {
    setCart((prev) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: { ...prev[productId], variant },
      };
    });
  };

  const cartList = Object.values(cart);
  const totalAmount = cartList.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      router.push("/login?redirect=/order");
      return;
    }

    if (cartList.length === 0) {
      setErrorMessage("Silakan pilih minimal 1 produk Ricake.");
      return;
    }

    setLoading(true);

    try {
      const payloadItems = cartList.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        variant: item.variant,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          notes,
          items: payloadItems,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Gagal membuat pesanan. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Redirect ke halaman detail tiket & pembayaran QRIS
      router.push(`/order/${data.order.id}`);
    } catch {
      setErrorMessage("Terjadi gangguan koneksi internet. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Brand Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-xs font-bold text-toasted-crust hover:text-espresso transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xl text-espresso">
              Ricake <span className="font-body text-xs font-bold px-2 py-0.5 rounded-full bg-butter-yellow border border-espresso">Order</span>
            </span>
          </div>
        </div>

        {/* Page Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter-cream border border-espresso/20 text-xs font-bold text-toasted-crust mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Pemesanan Online &amp; Pembayaran QRIS</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-espresso tracking-tight">
            Pesan Sajian Hangat Ricake
          </h1>
          <p className="font-body text-sm text-espresso/80 mt-1 max-w-2xl leading-relaxed">
            Pilih menu favoritmu, isi detail pengiriman, dan dapatkan tiket pesanan resmi beserta barcode QRIS untuk verifikasi instan.
          </p>
        </div>

        {/* Login Notification if not logged in */}
        {authChecked && !user && (
          <div className="p-4 rounded-2xl bg-paper-white border-2 border-espresso shadow-retro-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-butter-cream text-espresso border border-espresso/30 mt-0.5">
                <User className="w-5 h-5 text-toasted-crust" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-sm text-espresso">
                  Masuk untuk Menyimpan Tiket Pesanan
                </h3>
                <p className="font-body text-xs text-espresso/70 mt-0.5">
                  Anda perlu masuk agar tiket pesanan dapat dipantau di menu "Pesanan Saya".
                </p>
              </div>
            </div>
            <Link
              href="/login?redirect=/order"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-xs hover:bg-toasted-crust hover:text-paper-white transition-all shrink-0"
            >
              Login Sekarang
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 font-medium flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Pilihan Produk (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-md space-y-5">
              <div className="flex items-center justify-between border-b border-espresso/15 pb-4">
                <h2 className="font-display font-extrabold text-xl text-espresso flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-toasted-crust" />
                  <span>1. Pilih Menu Sajian</span>
                </h2>
                <span className="font-body text-xs text-espresso/60 font-semibold">
                  {cartList.length} produk dipilih
                </span>
              </div>

              <div className="space-y-4">
                {CATALOG.map((prod) => {
                  const isSelected = !!cart[prod.id];
                  const currentItem = cart[prod.id];

                  return (
                    <div
                      key={prod.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "bg-butter-cream/40 border-espresso shadow-retro-xs"
                          : "bg-warm-ivory/30 border-espresso/25 hover:border-espresso/50"
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-espresso shrink-0 bg-paper-white">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold font-body uppercase px-1.5 py-0.5 rounded bg-espresso text-paper-white">
                                {prod.category}
                              </span>
                              <h3 className="font-display font-bold text-sm sm:text-base text-espresso mt-1">
                                {prod.name}
                              </h3>
                              <p className="font-body text-xs text-espresso/70">
                                {prod.unit}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleProduct(prod)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSelected
                                  ? "bg-espresso text-paper-white border-espresso"
                                  : "bg-paper-white text-espresso border-espresso/40 hover:bg-butter-yellow"
                              }`}
                              aria-label={isSelected ? "Batal pilih" : "Pilih produk"}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-espresso/10">
                            <span className="font-display font-black text-sm sm:text-base text-espresso">
                              Rp {prod.price.toLocaleString("id-ID")}
                            </span>

                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(prod.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-paper-white border border-espresso flex items-center justify-center hover:bg-warm-ivory active:scale-95"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-display font-bold text-sm text-espresso w-6 text-center">
                                  {currentItem.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(prod.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-butter-yellow border border-espresso flex items-center justify-center hover:bg-toasted-crust hover:text-paper-white active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Pilihan Varian jika ada */}
                          {isSelected && prod.variants && (
                            <div className="mt-3 pt-3 border-t border-espresso/10 space-y-1.5">
                              <label className="font-body text-[11px] font-bold text-espresso/70 block uppercase tracking-wider">
                                Pilihan Saus / Rasa:
                              </label>
                              <select
                                value={currentItem.variant}
                                onChange={(e) => updateVariant(prod.id, e.target.value)}
                                className="w-full bg-paper-white text-espresso text-xs font-body font-medium px-3 py-1.5 rounded-lg border border-espresso/30 focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                              >
                                {prod.variants.map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail Pengiriman & Total (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-md space-y-5">
              <h2 className="font-display font-extrabold text-xl text-espresso border-b border-espresso/15 pb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-toasted-crust" />
                <span>2. Detail Pemesan</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                    Nama Penerima *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nama lengkap kamu"
                      className="w-full bg-warm-ivory/50 text-espresso px-3.5 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                    />
                    <User className="absolute right-3 top-2.5 w-4 h-4 text-warm-grey" />
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full bg-warm-ivory/50 text-espresso px-3.5 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                    />
                    <Phone className="absolute right-3 top-2.5 w-4 h-4 text-warm-grey" />
                  </div>
                  <p className="font-body text-[10px] text-espresso/60 mt-1">
                    Admin akan mengonfirmasi kesiapan pesanan dan pengantaran via WhatsApp ini.
                  </p>
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                    Alamat Pengantaran / Takeaway *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Contoh: Jl. Mawar No. 4, Citayam (atau tulis: Ambil sendiri di dapur Ricake)"
                    className="w-full bg-warm-ivory/50 text-espresso px-3.5 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                  />
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Minta saus dipisah, dikirim sebelum jam 3 sore"
                    className="w-full bg-warm-ivory/50 text-espresso px-3.5 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                  />
                </div>
              </div>

              {/* Ringkasan Biaya */}
              <div className="pt-4 border-t border-espresso/15 space-y-2.5 font-body text-xs text-espresso">
                <div className="flex justify-between text-espresso/80">
                  <span>Subtotal Pesanan:</span>
                  <span className="font-bold">Rp {totalAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-espresso/80">
                  <span>Biaya Admin &amp; Tiket:</span>
                  <span className="font-bold text-green-700">GRATIS</span>
                </div>
                <div className="pt-2 border-t border-dashed border-espresso/20 flex justify-between items-baseline">
                  <span className="font-display font-extrabold text-sm text-espresso">
                    Total Pembayaran:
                  </span>
                  <span className="font-display font-black text-xl text-espresso text-toasted-crust">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cartList.length === 0}
                className="w-full font-body font-bold text-sm text-espresso bg-butter-yellow hover:bg-toasted-crust hover:text-paper-white py-3.5 rounded-xl border-2 border-espresso shadow-retro transition-all active:translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menerbitkan Tiket Pesanan...</span>
                  </>
                ) : (
                  <span>Lanjut ke Pembayaran QRIS →</span>
                )}
              </button>

              <p className="font-body text-[11px] text-center text-espresso/60 leading-relaxed">
                Tiket pesanan akan diterbitkan dengan status <strong>Menunggu Konfirmasi</strong> setelah Anda melakukan scan QRIS.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
