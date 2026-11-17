"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Newspaper,
  PlusCircle,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Globe,
  FileText,
  Info,
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  created_at: string;
}

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Modal State (Create or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<"draft" | "published">("published");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal Konfirmasi Hapus
  const [deletingItem, setDeletingItem] = useState<NewsItem | null>(null);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (data.success) {
        setNewsList(data.news);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memuat artikel berita." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormContent("");
    setFormStatus("published");
    setThumbnailFile(null);
    setThumbnailPreview("/images/products/churros.jpg");
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormExcerpt(item.excerpt);
    setFormContent(item.content);
    setFormStatus(item.status);
    setThumbnailFile(null);
    setThumbnailPreview(item.thumbnail_path || "/images/products/churros.jpg");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal adalah 5MB.");
        return;
      }
      setThumbnailFile(file);
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setMessage({ type: "error", text: "Judul berita wajib diisi." });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (editingId) formData.append("id", editingId);
      formData.append("title", formTitle);
      formData.append("excerpt", formExcerpt);
      formData.append("content", formContent);
      formData.append("status", formStatus);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else if (thumbnailPreview && !thumbnailPreview.startsWith("blob:")) {
        formData.append("thumbnail_path", thumbnailPreview);
      }

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/news", {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menyimpan berita." });
        setActionLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: editingId ? "Berita berhasil diperbarui!" : "Berita baru berhasil ditambahkan!",
      });

      setIsModalOpen(false);
      await fetchNews();
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan jaringan saat menyimpan artikel." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (item: NewsItem) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah status." });
        return;
      }

      setMessage({
        type: "success",
        text: `Status berita "${item.title}" diubah menjadi ${nextStatus}.`,
      });
      await fetchNews();
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat mengubah status." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(deletingItem.id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menghapus berita." });
        setActionLoading(false);
        return;
      }

      setMessage({ type: "success", text: `Berita "${deletingItem.title}" berhasil dihapus.` });
      setDeletingItem(null);
      await fetchNews();
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan saat menghapus berita." });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredNews = newsList.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-espresso tracking-tight">
            Berita & Cerita Ricake
          </h1>
          <p className="font-body text-xs sm:text-sm text-espresso/70 mt-1">
            Kelola artikel dapur, tips memanggang, dan kabar rilis produk untuk ditampilkan di beranda.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Info Media Vercel Reminder */}
      <div className="bg-warm-ivory border border-espresso/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-body text-espresso/80">
        <Info className="w-4 h-4 text-toasted-crust shrink-0 mt-0.5" />
        <div>
          <strong>Info Penyimpanan Media:</strong> Gambar artikel saat ini disimpan di folder lokal{" "}
          <code className="bg-paper-white px-1 rounded border border-espresso/20">public/uploads/</code>. Di Step 4, sistem dapat dimigrasikan ke cloud storage (seperti Vercel Blob / Cloudinary) agar gambar tetap permanen setelah website dipublikasikan ke Vercel.
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all ${
            filterStatus === "all"
              ? "bg-espresso text-paper-white shadow-retro-xs"
              : "bg-paper-white text-espresso border border-espresso/30 hover:bg-warm-ivory"
          }`}
        >
          Semua ({newsList.length})
        </button>
        <button
          onClick={() => setFilterStatus("published")}
          className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all ${
            filterStatus === "published"
              ? "bg-espresso text-paper-white shadow-retro-xs"
              : "bg-paper-white text-espresso border border-espresso/30 hover:bg-warm-ivory"
          }`}
        >
          Terbit ({newsList.filter((n) => n.status === "published").length})
        </button>
        <button
          onClick={() => setFilterStatus("draft")}
          className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all ${
            filterStatus === "draft"
              ? "bg-espresso text-paper-white shadow-retro-xs"
              : "bg-paper-white text-espresso border border-espresso/30 hover:bg-warm-ivory"
          }`}
        >
          Draf ({newsList.filter((n) => n.status === "draft").length})
        </button>
      </div>

      {/* Grid of News Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-espresso mb-2" />
          <p className="font-body text-xs text-espresso/70">Memuat artikel berita...</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-paper-white border-2 border-espresso rounded-2xl p-12 text-center shadow-retro-sm">
          <Newspaper className="w-10 h-10 text-espresso/30 mx-auto mb-3" />
          <h2 className="font-display font-extrabold text-lg text-espresso mb-1">
            Belum Ada Artikel
          </h2>
          <p className="font-body text-xs text-espresso/70 mb-4 max-w-sm mx-auto">
            Klik tombol "Tulis Artikel Baru" untuk membuat dan menerbitkan cerita seputar kue homemade Ricake.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-paper-white border-2 border-espresso rounded-2xl overflow-hidden shadow-retro-md flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] bg-warm-ivory border-b-2 border-espresso overflow-hidden group">
                  <Image
                    src={item.thumbnail_path || "/images/products/churros.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-retro-xs ${
                        item.status === "published"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[11px] font-bold font-body text-toasted-crust mb-1">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h2 className="font-display font-extrabold text-lg text-espresso mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="font-body text-xs text-espresso/70 line-clamp-3 leading-relaxed">
                    {item.excerpt || item.content}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 pt-2 border-t border-espresso/10 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(item)}
                  disabled={actionLoading}
                  className={`text-[11px] font-bold font-body underline transition-colors ${
                    item.status === "published"
                      ? "text-yellow-700 hover:text-yellow-900"
                      : "text-green-700 hover:text-green-900"
                  }`}
                >
                  {item.status === "published" ? "Ubah ke Draf" : "Terbitkan (Publish)"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    title="Ubah Berita"
                    className="p-1.5 rounded-lg bg-warm-ivory border border-espresso/30 text-espresso hover:bg-butter-yellow transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    title="Hapus Berita"
                    className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Berita (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-paper-white w-full max-w-2xl rounded-2xl border-2 border-espresso shadow-retro-xl p-6 sm:p-8 my-8 relative">
            <h2 className="font-display font-black text-2xl text-espresso mb-1">
              {editingId ? "Ubah Artikel Berita" : "Tulis Artikel Baru"}
            </h2>
            <p className="font-body text-xs text-espresso/70 mb-5">
              Isi data artikel untuk ditampilkan pada section berita di halaman utama.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Rahasia Churros Tetap Renyah Setelah Digoreng"
                  className="w-full bg-warm-ivory/50 text-espresso px-3.5 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat yang tampil di kartu beranda..."
                  className="w-full bg-warm-ivory/50 text-espresso px-3.5 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Isi Lengkap Artikel
                </label>
                <textarea
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Tulis cerita lengkap atau tips memanggang di sini..."
                  className="w-full bg-warm-ivory/50 text-espresso px-3.5 py-2 rounded-lg border border-espresso/30 text-xs font-body focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                />
              </div>

              {/* Upload Gambar Thumbnail */}
              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Gambar Thumbnail
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-warm-ivory/50 rounded-xl border border-espresso/20">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-espresso shrink-0 bg-paper-white">
                    <Image
                      src={thumbnailPreview || "/images/products/churros.jpg"}
                      alt="Pratinjau"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-white text-espresso border border-espresso font-body text-xs font-bold hover:bg-butter-yellow transition-colors shadow-retro-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-toasted-crust" />
                      <span>Unggah Gambar Baru</span>
                    </button>
                    <p className="font-body text-[11px] text-espresso/60">
                      Format: JPG, PNG, atau WebP (Maks. 5MB).
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Publikasi */}
              <div>
                <label className="font-body text-xs uppercase tracking-wider font-bold text-espresso block mb-1">
                  Status Artikel
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-body text-xs font-bold text-espresso">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "published"}
                      onChange={() => setFormStatus("published")}
                      className="text-espresso focus:ring-butter-yellow"
                    />
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-green-700" />
                      <span>Terbitkan Langsung (Published)</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-body text-xs font-bold text-espresso">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "draft"}
                      onChange={() => setFormStatus("draft")}
                      className="text-espresso focus:ring-butter-yellow"
                    />
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-yellow-700" />
                      <span>Simpan sebagai Draf</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-espresso/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-xs font-bold font-body text-espresso hover:bg-warm-ivory"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-butter-yellow text-espresso font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-toasted-crust hover:text-paper-white transition-all flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{editingId ? "Perbarui Berita" : "Simpan Berita"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-white w-full max-w-md rounded-2xl border-2 border-espresso shadow-retro-xl p-6">
            <h3 className="font-display font-extrabold text-lg text-red-700 mb-1">
              Hapus Artikel Berita?
            </h3>
            <p className="font-body text-xs text-espresso/80 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus artikel <strong>"{deletingItem.title}"</strong>? Thumbnail dan data berita akan dihapus permanen.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-bold font-body text-espresso hover:bg-warm-ivory"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-paper-white font-body text-xs font-bold border-2 border-espresso shadow-retro-sm hover:bg-red-700 transition-all flex items-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Ya, Hapus Artikel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
