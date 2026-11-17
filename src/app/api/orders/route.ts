import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, OrderRecord, OrderItem } from "@/lib/appsScript";

// GET /api/orders - Mengambil daftar pesanan milik pengguna yang sedang login
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu untuk melihat pesanan." },
        { status: 401 }
      );
    }

    const allOrders = await db.list<OrderRecord>("Orders");

    // Jika admin, kembalikan semua. Jika user, hanya pesanan miliknya
    const orders =
      session.role === "admin"
        ? allOrders
        : allOrders.filter((o) => o.user_id === session.userId);

    // Urutkan dari pesanan terbaru
    orders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memuat pesanan: " + err.message },
      { status: 500 }
    );
  }
}

// POST /api/orders - Membuat tiket pesanan baru
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu untuk melakukan pemesanan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customer_name, customer_phone, customer_address, notes, items } = body;

    // Validasi form
    if (!customer_name || typeof customer_name !== "string" || customer_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama penerima wajib diisi minimal 2 karakter." },
        { status: 400 }
      );
    }

    const phoneStr = String(customer_phone || "").trim();
    if (!phoneStr || phoneStr.length < 8) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp aktif wajib diisi minimal 8 digit." },
        { status: 400 }
      );
    }

    if (!customer_address || typeof customer_address !== "string" || customer_address.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Alamat pengantaran / catatan takeaway wajib diisi." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pilih minimal satu produk untuk dipesan." },
        { status: 400 }
      );
    }

    // Hitung total dan validasi kuantitas
    let totalAmount = 0;
    const sanitizedItems: OrderItem[] = [];

    for (const it of items) {
      const qty = parseInt(it.quantity, 10);
      const price = parseInt(it.unit_price, 10);
      if (isNaN(qty) || qty <= 0) {
        return NextResponse.json(
          { success: false, error: `Jumlah pesanan untuk ${it.product_name} harus lebih dari 0.` },
          { status: 400 }
        );
      }
      const subtotal = qty * price;
      totalAmount += subtotal;

      sanitizedItems.push({
        product_id: String(it.product_id || ""),
        product_name: String(it.product_name || "Produk Ricake"),
        variant: it.variant ? String(it.variant) : undefined,
        quantity: qty,
        unit_price: price,
        subtotal,
      });
    }

    if (totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Total nominal pesanan tidak valid." },
        { status: 400 }
      );
    }

    // Buat kode tiket pesanan unik (contoh: RCK-104921)
    const ticket_code = `RCK-${Date.now().toString().slice(-6)}`;

    const newOrder = await db.create<OrderRecord>("Orders", {
      ticket_code,
      user_id: session.userId,
      customer_name: customer_name.trim(),
      customer_phone: phoneStr,
      customer_address: customer_address.trim(),
      items: JSON.stringify(sanitizedItems),
      total_amount: totalAmount,
      notes: (notes || "").trim(),
      status: "menunggu_konfirmasi",
    });

    return NextResponse.json({
      success: true,
      message: "Tiket pesanan berhasil dibuat! Silakan lanjutkan pembayaran dengan QRIS.",
      order: newOrder,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal membuat pesanan: " + err.message },
      { status: 500 }
    );
  }
}
