import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/appsScript";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = params;
    let order = await db.get<OrderRecord>("Orders", "id", id);
    if (!order) {
      order = await db.get<OrderRecord>("Orders", "ticket_code", id);
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Proteksi: Pengguna hanya boleh melihat tiket miliknya sendiri, kecuali jika admin
    if (session.role !== "admin" && order.user_id !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki izin untuk melihat pesanan ini." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pesanan: " + err.message },
      { status: 500 }
    );
  }
}
