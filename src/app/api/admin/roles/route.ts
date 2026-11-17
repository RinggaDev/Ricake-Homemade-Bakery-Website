import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db, RoleRecord, UserRecord } from "@/lib/appsScript";

// GET /api/admin/roles - Mengambil daftar seluruh role
export async function GET() {
  try {
    await requireAdmin();
    const roles = await db.list<RoleRecord>("Roles");
    return NextResponse.json({ success: true, roles });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar role: " + err.message },
      { status }
    );
  }
}

// POST /api/admin/roles - Menambah role baru kustom
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama role wajib diisi minimal 2 karakter." },
        { status: 400 }
      );
    }

    const cleanName = name.trim().toLowerCase();
    const roles = await db.list<RoleRecord>("Roles");

    if (roles.some((r) => r.name.toLowerCase() === cleanName)) {
      return NextResponse.json(
        { success: false, error: `Role dengan nama "${cleanName}" sudah ada.` },
        { status: 409 }
      );
    }

    const newRole = await db.create<RoleRecord>("Roles", {
      name: cleanName,
      description: (description || "").trim(),
      permissions: (permissions || "").trim(),
      is_system: false,
    });

    return NextResponse.json({
      success: true,
      message: `Role "${newRole.name}" berhasil dibuat.`,
      role: newRole,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal membuat role: " + err.message },
      { status }
    );
  }
}

// PUT /api/admin/roles - Memperbarui role
export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, description, permissions } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID role wajib disertakan." },
        { status: 400 }
      );
    }

    const targetRole = await db.get<RoleRecord>("Roles", "id", id);
    if (!targetRole) {
      return NextResponse.json(
        { success: false, error: "Role tidak ditemukan." },
        { status: 404 }
      );
    }

    const updates: Partial<RoleRecord> = {};
    if (typeof description === "string") updates.description = description.trim();
    if (typeof permissions === "string") updates.permissions = permissions.trim();

    const updated = await db.update<RoleRecord>("Roles", id, updates);

    return NextResponse.json({
      success: true,
      message: `Role "${updated.name}" berhasil diperbarui.`,
      role: updated,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui role: " + err.message },
      { status }
    );
  }
}

// DELETE /api/admin/roles - Menghapus role kustom
export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID role wajib disertakan." },
        { status: 400 }
      );
    }

    const targetRole = await db.get<RoleRecord>("Roles", "id", id);
    if (!targetRole) {
      return NextResponse.json(
        { success: false, error: "Role tidak ditemukan." },
        { status: 404 }
      );
    }

    // Proteksi: Role sistem tidak boleh dihapus
    if (targetRole.is_system) {
      return NextResponse.json(
        { success: false, error: `Role "${targetRole.name}" adalah role sistem bawaan dan tidak dapat dihapus.` },
        { status: 403 }
      );
    }

    // Proteksi: Role tidak boleh dihapus jika masih digunakan oleh pengguna
    const users = await db.list<UserRecord>("Users");
    const usersWithThisRole = users.filter((u) => u.role_id === id);
    if (usersWithThisRole.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Role tidak dapat dihapus karena masih digunakan oleh ${usersWithThisRole.length} pengguna. Ubah role pengguna terkait terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    await db.delete("Roles", id);

    return NextResponse.json({
      success: true,
      message: `Role "${targetRole.name}" berhasil dihapus.`,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal menghapus role: " + err.message },
      { status }
    );
  }
}
