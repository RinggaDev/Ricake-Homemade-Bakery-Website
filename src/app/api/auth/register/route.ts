import { NextResponse } from "next/server";
import { db, UserRecord, RoleRecord } from "@/lib/appsScript";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap wajib diisi minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existing = await db.get<UserRecord>("Users", "email", cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar. Silakan login atau gunakan email lain." },
        { status: 409 }
      );
    }

    // Ambil default role 'user'
    const roles = await db.list<RoleRecord>("Roles");
    const userRole = roles.find((r) => r.name.toLowerCase() === "user") || {
      id: "role-user-01",
      name: "user",
    };

    const hashedPassword = await hashPassword(password);

    const newUser = await db.create<UserRecord>("Users", {
      name: name.trim(),
      email: cleanEmail,
      password_hash: hashedPassword,
      role_id: userRole.id,
      status: "active",
    });

    // Otomatis buat sesi login setelah pendaftaran berhasil
    await createSession({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "user",
      roleId: userRole.id,
    });

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil! Selamat datang di Ricake.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: "user",
      },
      redirectUrl: "/portal",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses pendaftaran: " + err.message },
      { status: 500 }
    );
  }
}
