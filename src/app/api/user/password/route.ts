import { NextResponse } from "next/server";
import { requireAuth, verifyPassword, hashPassword } from "@/lib/auth";
import { db, UserRecord } from "@/lib/appsScript";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password saat ini dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    const user = await db.get<UserRecord>("Users", "id", session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Data pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Password saat ini salah." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.update<UserRecord>("Users", session.userId, {
      password_hash: newHash,
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui. Silakan gunakan password baru ini saat login berikutnya.",
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Sesi telah berakhir. Silakan login kembali." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui password: " + err.message },
      { status: 500 }
    );
  }
}
