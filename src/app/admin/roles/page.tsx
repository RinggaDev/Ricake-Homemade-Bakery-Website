"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  PlusCircle,
  Edit2,
  Trash2,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key,
} from "lucide-react";

interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState("");

  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editPerms, setEditPerms] = useState("");

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      if (data.success) setRoles(data.roles);
    } catch {
      setMessage({ type: "error", text: "Gagal mengambil daftar peran." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, permissions }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal membuat peran baru." });
        setActionLoading(false);
        return;
      }

      setMessage({ type: "success", text: `Peran "${name}" berhasil dibuat.` });
      setShowCreateModal(false);
      setName("");
      setDescription("");
      setPermissions("");
      await fetchRoles();
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRole.id,
          description: editDesc,
          permissions: editPerms,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal memperbarui peran." });
        setActionLoading(false);
        return;
      }

      setMessage({ type: "success", text: `Peran "${editingRole.name}" berhasil diperbarui.` });
      setEditingRole(null);
      await fetchRoles();
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan saat menyimpan perubahan peran." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (role: RoleRecord) => {
    if (role.is_system) {
      alert("Role sistem bawaan tidak dapat dihapus.");
      return;
    }

    if (!confirm(`Hapus peran "${role.name}"? Pastikan tidak ada akun yang menggunakan peran ini.`)) {
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/roles?id=${encodeURIComponent(role.id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menghapus peran." });
        return;
      }

      setMessage({ type: "success", text: `Peran "${role.name}" berhasil dihapus.` });
      await fetchRoles();
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi saat menghapus peran." });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-espresso tracking-tight">
            Manajemen Peran & Izin
          </h1>
          <p className="font-body text-xs sm:text-sm text-espresso/70 mt-1">
            Kelola hak akses untuk administrator dan pengguna sistem.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Peran Baru</span>
        </button>
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

      {/* Grid of Roles */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-espresso mb-2" />
          <p className="font-body text-xs text-espresso/70">Memuat data peran...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-paper-white border-2 border-espresso rounded-2xl p-6 shadow-retro-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-butter-yellow border border-espresso flex items-center justify-center text-espresso shadow-retro-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="font-display font-extrabold text-xl text-espresso capitalize">
                      {role.name}
                    </h2>
                  </div>
                  {role.is_system ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-warm-ivory text-espresso border border-espresso/40">
                      <Lock className="w-3 h-3 text-toasted-crust" />
                      <span>Sistem</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-800 border border-green-300">
                      <span>Kustom</span>
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-espresso/80 mb-4 leading-relaxed">
                  {role.description || "Tidak ada deskripsi."}
                </p>

                <div className="p-3 rounded-xl bg-warm-ivory/60 border border-espresso/20 mb-4">
                  <div className="flex items-center gap-1.5 font-body text-[11px] font-bold text-toasted-crust mb-1">
                    <Key className="w-3 h-3" />
                    <span>Izin Akses (Permissions):</span>
                  </div>
                  <code className="font-mono text-xs text-espresso font-semibold block break-all">
                    {role.permissions || "(none)"}
                  </code>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-espresso/10">
                <button
                  onClick={() => {
                    setEditingRole(role);
                    setEditDesc(role.description);
                    setEditPerms(role.permissions);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-ivory border border-espresso/30 text-xs font-bold text-espresso hover:bg-butter-yellow transition-colors font-body"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Ubah</span>
                </button>

                {!role.is_system && (
                  <button
                    onClick={() => handleDelete(role)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors font-body"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Role */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-white w-full max-w-md rounded-2xl border-2 border-espresso shadow-retro-xl p-6">
            <h3 className="font-display font-extrabold text-xl text-espresso mb-1">
              Tambah Peran Baru
            </h3>
            <p className="font-body text-xs text-espresso/70 mb-4">
              Buat peran baru untuk pengelompokan hak akses staf atau pelanggan.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Nama Peran (huruf kecil tanpa spasi)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="editor / staff"
                  className="w-full bg-warm-ivory/50 text-espresso px-3 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi peran dan tanggung jawabnya..."
                  className="w-full bg-warm-ivory/50 text-espresso px-3 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Permissions (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={permissions}
                  onChange={(e) => setPermissions(e.target.value)}
                  placeholder="news:create,news:update,order:read"
                  className="w-full bg-warm-ivory/50 text-espresso px-3 py-2 rounded-lg border border-espresso/30 text-xs font-body font-mono focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
                  <span>Buat Peran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Role */}
      {editingRole && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-white w-full max-w-md rounded-2xl border-2 border-espresso shadow-retro-xl p-6">
            <h3 className="font-display font-extrabold text-xl text-espresso mb-1">
              Ubah Peran: {editingRole.name}
            </h3>
            <p className="font-body text-xs text-espresso/70 mb-4">
              Perbarui deskripsi dan izin akses untuk peran ini.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-warm-ivory/50 text-espresso px-3 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Permissions (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={editPerms}
                  onChange={(e) => setEditPerms(e.target.value)}
                  className="w-full bg-warm-ivory/50 text-espresso px-3 py-2 rounded-lg border border-espresso/30 text-xs font-body font-mono focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
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
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
