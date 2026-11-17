import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, UserRecord } from "@/lib/appsScript";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await db.get<UserRecord>("Users", "id", session.userId);
    if (!user || user.status !== "active") {
      return NextResponse.json({ success: false, user: null, error: "Sesi tidak aktif atau akun dinonaktifkan." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: session.role,
        status: user.status,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memverifikasi sesi: " + err.message },
      { status: 500 }
    );
  }
}
