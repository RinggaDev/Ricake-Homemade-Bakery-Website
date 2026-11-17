import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/appsScript";

// GET /api/admin/orders - Mengambil seluruh tiket pesanan dari semua customer
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let orders = await db.list<OrderRecord>("Orders");

    if (statusFilter && ["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"].includes(statusFilter)) {
      orders = orders.filter((o) => o.status === statusFilter);
    }

    orders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar pesanan: " + err.message },
      { status }
    );
  }
}

// PUT /api/admin/orders - Konfirmasi pembayaran atau batalkan pesanan
export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, status, cancel_reason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID pesanan dan status baru wajib disertakan." },
        { status: 400 }
      );
    }

    if (!["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status pesanan tidak valid." },
        { status: 400 }
      );
    }

    const order = await db.get<OrderRecord>("Orders", "id", id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const updates: Partial<OrderRecord> = { status };
    if (typeof cancel_reason === "string") {
      updates.cancel_reason = cancel_reason.trim();
    }

    const updated = await db.update<OrderRecord>("Orders", id, updates);

    return NextResponse.json({
      success: true,
      message: `Status pesanan ${order.ticket_code} berhasil diubah menjadi "${status}".`,
      order: updated,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pesanan: " + err.message },
      { status }
    );
  }
}
