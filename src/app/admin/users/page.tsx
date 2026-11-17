"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Shield,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserX,
  UserCheck,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal Ubah Role
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // Modal Konfirmasi Hapus
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  const fetchUsers = async () => {
    try {
      const [uRes, rRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
      ]);

      const uData = await uRes.json();
      const rData = await rRes.json();

      if (uData.success) setUsers(uData.users);
      if (rData.success) setRoles(rData.roles);
    } catch {
      setMessage({ type: "error", text: "Gagal memuat data pengguna." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    const confirmText =
      nextStatus === "inactive"
        ? `Apakah Anda yakin ingin menonaktifkan pengguna "${user.name}"? Pengguna tidak akan bisa login.`
        : `Aktifkan kembali akun "${user.name}"?`;

    if (!confirm(confirmText)) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah status." });
        return;
      }

      setMessage({ type: "success", text: `Status pengguna "${user.name}" berhasil diubah menjadi ${nextStatus}.` });
      await fetchUsers();
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat mengubah status." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !selectedRoleId) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingUser.id, role_id: selectedRoleId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah peran." });
        setActionLoading(false);
        return;
      }

      setMessage({ type: "success", text: `Peran untuk "${editingUser.name}" berhasil diperbarui.` });
      setEditingUser(null);
      await fetchUsers();
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan koneksi saat mengubah peran." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(deletingUser.id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menghapus pengguna." });
        setActionLoading(false);
        return;
      }

      setMessage({ type: "success", text: `Pengguna "${deletingUser.name}" berhasil dihapus.` });
      setDeletingUser(null);
      await fetchUsers();
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menghapus pengguna." });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-espresso tracking-tight">
            Manajemen Pengguna
          </h1>
          <p className="font-body text-xs sm:text-sm text-espresso/70 mt-1">
            Kelola daftar akun administrator dan pelanggan Ricake.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-body font-medium flex items-center gap-2.5 animate-fadeIn ${
            message.type === "success"
              ? "bg-green-50 border-green-300 text-green-900"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-paper-white border-2 border-espresso rounded-2xl p-4 shadow-retro-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-warm-grey shrink-0 ml-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama, email, atau peran..."
          className="w-full bg-transparent font-body text-xs text-espresso placeholder:text-warm-grey focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-espresso/60 hover:text-espresso font-body"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-paper-white border-2 border-espresso rounded-2xl shadow-retro-md overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-espresso mb-2" />
            <p className="font-body text-xs text-espresso/70">Memuat data pengguna...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-espresso/60 font-body text-xs">
            {search ? "Tidak ada pengguna yang cocok dengan pencarian." : "Belum ada pengguna."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs">
              <thead>
                <tr className="bg-warm-ivory border-b-2 border-espresso text-espresso uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-warm-ivory/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-espresso">{user.name}</td>
                    <td className="py-3.5 px-4 font-mono text-espresso/80">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          user.role_name === "admin"
                            ? "bg-butter-yellow text-espresso border-espresso"
                            : "bg-butter-cream text-toasted-crust border-toasted-crust/30"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{user.role_name}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }`}
                      >
                        {user.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-espresso/70">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ubah Role */}
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setSelectedRoleId(user.role_id);
                          }}
                          title="Ubah Peran"
                          className="p-1.5 rounded-lg bg-warm-ivory border border-espresso/30 text-espresso hover:bg-butter-yellow transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoading}
                          title={user.status === "active" ? "Nonaktifkan Pengguna" : "Aktifkan Pengguna"}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            user.status === "active"
                              ? "bg-warm-ivory border-espresso/30 text-espresso hover:bg-yellow-100"
                              : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {user.status === "active" ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Hapus Pengguna */}
                        <button
                          onClick={() => setDeletingUser(user)}
                          title="Hapus Pengguna"
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Ubah Role */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-white w-full max-w-sm rounded-2xl border-2 border-espresso shadow-retro-xl p-6">
            <h3 className="font-display font-extrabold text-lg text-espresso mb-1">
              Ubah Peran Akun
            </h3>
            <p className="font-body text-xs text-espresso/70 mb-4">
              Pilih peran baru untuk <strong>{editingUser.name}</strong> ({editingUser.email})
            </p>

            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Pilih Peran
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full bg-warm-ivory/50 text-espresso px-3 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-body text-espresso hover:bg-warm-ivory"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 rounded-lg bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Simpan Peran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-white w-full max-w-sm rounded-2xl border-2 border-espresso shadow-retro-xl p-6">
            <h3 className="font-display font-extrabold text-lg text-red-700 mb-1">
              Konfirmasi Hapus Pengguna
            </h3>
            <p className="font-body text-xs text-espresso/80 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>{deletingUser.name}</strong> (
              {deletingUser.email})? Tindakan ini permanen dan tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-bold font-body text-espresso hover:bg-warm-ivory"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-paper-white font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-red-700 transition-all flex items-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Ya, Hapus Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
