import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db, UserRecord, RoleRecord } from "@/lib/appsScript";

// GET /api/admin/users - Mendapatkan daftar seluruh pengguna
export async function GET() {
  try {
    await requireAdmin();

    const [users, roles] = await Promise.all([
      db.list<UserRecord>("Users"),
      db.list<RoleRecord>("Roles"),
    ]);

    const roleMap = new Map(roles.map((r) => [r.id, r]));

    // Format data pengguna tanpa mengekspos hash password
    const safeUsers = users.map((u) => {
      const role = roleMap.get(u.role_id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role_id: u.role_id,
        role_name: role ? role.name : "unknown",
        status: u.status,
        created_at: u.created_at,
        updated_at: u.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      users: safeUsers,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar pengguna: " + err.message },
      { status }
    );
  }
}

// PUT /api/admin/users - Memperbarui status atau role pengguna
export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { id, role_id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID pengguna wajib disertakan." },
        { status: 400 }
      );
    }

    const targetUser = await db.get<UserRecord>("Users", "id", id);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const [allUsers, roles] = await Promise.all([
      db.list<UserRecord>("Users"),
      db.list<RoleRecord>("Roles"),
    ]);

    const adminRole = roles.find((r) => r.name.toLowerCase() === "admin");
    const adminRoleId = adminRole ? adminRole.id : "role-admin-01";

    // Hitung berapa admin aktif yang ada
    const activeAdmins = allUsers.filter(
      (u) => u.role_id === adminRoleId && u.status === "active"
    );

    // Proteksi: Admin tidak boleh menonaktifkan dirinya sendiri
    if (session.userId === id && status && status !== "active") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
        { status: 400 }
      );
    }

    // Proteksi: Tidak boleh menonaktifkan admin terakhir
    if (
      targetUser.role_id === adminRoleId &&
      status === "inactive" &&
      activeAdmins.length <= 1
    ) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menonaktifkan satu-satunya admin aktif dalam sistem." },
        { status: 400 }
      );
    }

    // Proteksi: Admin tidak boleh mengubah role dirinya sendiri menjadi non-admin jika dia admin terakhir
    if (
      session.userId === id &&
      role_id &&
      role_id !== adminRoleId &&
      activeAdmins.length <= 1
    ) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat mengubah role satu-satunya admin aktif." },
        { status: 400 }
      );
    }

    const updates: Partial<UserRecord> = {};
    if (role_id) updates.role_id = role_id;
    if (status && (status === "active" || status === "inactive")) updates.status = status;

    const updated = await db.update<UserRecord>("Users", id, updates);

    return NextResponse.json({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role_id: updated.role_id,
        status: updated.status,
      },
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pengguna: " + err.message },
      { status }
    );
  }
}

// DELETE /api/admin/users - Menghapus pengguna
export async function DELETE(request: Request) {
  try {
    const session = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID pengguna wajib disertakan." },
        { status: 400 }
      );
    }

    // Proteksi: Admin tidak boleh menghapus dirinya sendiri
    if (session.userId === id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const targetUser = await db.get<UserRecord>("Users", "id", id);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const [allUsers, roles] = await Promise.all([
      db.list<UserRecord>("Users"),
      db.list<RoleRecord>("Roles"),
    ]);

    const adminRole = roles.find((r) => r.name.toLowerCase() === "admin");
    const adminRoleId = adminRole ? adminRole.id : "role-admin-01";

    // Proteksi: Tidak boleh menghapus admin terakhir
    if (targetUser.role_id === adminRoleId) {
      const remainingAdmins = allUsers.filter(
        (u) => u.role_id === adminRoleId && u.id !== id
      );
      if (remainingAdmins.length === 0) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat menghapus satu-satunya admin dalam sistem." },
          { status: 400 }
        );
      }
    }

    await db.delete("Users", id);

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus.",
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pengguna: " + err.message },
      { status }
    );
  }
}
