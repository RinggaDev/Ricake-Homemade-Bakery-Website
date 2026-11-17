import { NextResponse } from "next/server";
import { db, UserRecord, RoleRecord } from "@/lib/appsScript";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await db.get<UserRecord>("Users", "email", cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password belum sesuai." },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Akun ini sedang dinonaktifkan. Silakan hubungi admin Ricake." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password belum sesuai." },
        { status: 401 }
      );
    }

    // Ambil data role
    const roles = await db.list<RoleRecord>("Roles");
    const roleRecord = roles.find((r) => r.id === user.role_id) || {
      id: "role-user-01",
      name: "user",
    };

    const roleName = roleRecord.name;

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: roleName,
      roleId: user.role_id,
    });

    const redirectUrl = roleName === "admin" ? "/admin" : "/portal";

    return NextResponse.json({
      success: true,
      message: "Login berhasil! Selamat datang kembali.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: roleName,
      },
      redirectUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses login: " + err.message },
      { status: 500 }
    );
  }
}
