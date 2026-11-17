import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db, NewsRecord } from "@/lib/appsScript";
import { saveFile, deleteFile } from "@/lib/storage";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, "") // Hapus karakter non-word
    .replace(/\-\-+/g, "-") // Ganti ganda - dengan tunggal
    .replace(/^-+/, "") // Potong - di depan
    .replace(/-+$/, ""); // Potong - di belakang
}

// GET /api/admin/news - Mengambil seluruh berita (termasuk draft)
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let news = await db.list<NewsRecord>("News");

    if (statusFilter === "published" || statusFilter === "draft") {
      news = news.filter((n) => n.status === statusFilter);
    }

    // Urutkan dari yang terbaru
    news.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, news });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar berita: " + err.message },
      { status }
    );
  }
}

// POST /api/admin/news - Menambah berita baru (mendukung FormData & upload file)
export async function POST(request: Request) {
  try {
    const session = await requireAdmin();

    let title = "";
    let excerpt = "";
    let content = "";
    let status: "draft" | "published" = "draft";
    let thumbnail_path = "/images/products/churros.jpg";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = (formData.get("title") as string) || "";
      excerpt = (formData.get("excerpt") as string) || "";
      content = (formData.get("content") as string) || "";
      const rawStatus = (formData.get("status") as string) || "draft";
      status = rawStatus === "published" ? "published" : "draft";

      const file = formData.get("thumbnail") as File | null;
      if (file && file.size > 0) {
        const uploadResult = await saveFile(file);
        if (!uploadResult.success) {
          return NextResponse.json(
            { success: false, error: uploadResult.error },
            { status: 400 }
          );
        }
        thumbnail_path = uploadResult.filePath!;
      } else {
        const providedPath = formData.get("thumbnail_path") as string | null;
        if (providedPath) thumbnail_path = providedPath;
      }
    } else {
      const body = await request.json();
      title = body.title || "";
      excerpt = body.excerpt || "";
      content = body.content || "";
      status = body.status === "published" ? "published" : "draft";
      if (body.thumbnail_path) thumbnail_path = body.thumbnail_path;
    }

    if (!title.trim()) {
      return NextResponse.json(
        { success: false, error: "Judul berita wajib diisi." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newArticle = await db.create<NewsRecord>("News", {
      title: title.trim(),
      slug,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      thumbnail_path,
      status,
      author_id: session.userId,
    });

    return NextResponse.json({
      success: true,
      message: `Berita "${newArticle.title}" berhasil disimpan.`,
      news: newArticle,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal membuat berita: " + err.message },
      { status }
    );
  }
}

// PUT /api/admin/news - Memperbarui berita
export async function PUT(request: Request) {
  try {
    await requireAdmin();

    let id = "";
    let title: string | undefined;
    let excerpt: string | undefined;
    let content: string | undefined;
    let status: ("draft" | "published") | undefined;
    let newThumbnailFile: File | null = null;
    let explicitThumbnailPath: string | undefined;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = (formData.get("id") as string) || "";
      if (formData.has("title")) title = formData.get("title") as string;
      if (formData.has("excerpt")) excerpt = formData.get("excerpt") as string;
      if (formData.has("content")) content = formData.get("content") as string;
      if (formData.has("status")) {
        const s = formData.get("status") as string;
        status = s === "published" ? "published" : "draft";
      }
      if (formData.has("thumbnail")) {
        const file = formData.get("thumbnail") as File | null;
        if (file && file.size > 0) {
          newThumbnailFile = file;
        }
      }
      if (formData.has("thumbnail_path")) {
        explicitThumbnailPath = formData.get("thumbnail_path") as string;
      }
    } else {
      const body = await request.json();
      id = body.id;
      title = body.title;
      excerpt = body.excerpt;
      content = body.content;
      if (body.status) status = body.status === "published" ? "published" : "draft";
      explicitThumbnailPath = body.thumbnail_path;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID berita wajib disertakan." },
        { status: 400 }
      );
    }

    const existingNews = await db.get<NewsRecord>("News", "id", id);
    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan." },
        { status: 404 }
      );
    }

    const updates: Partial<NewsRecord> = {};
    if (typeof title === "string" && title.trim()) {
      updates.title = title.trim();
      updates.slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    }
    if (typeof excerpt === "string") updates.excerpt = excerpt.trim();
    if (typeof content === "string") updates.content = content.trim();
    if (status) updates.status = status;

    // Jika ada upload gambar thumbnail baru
    if (newThumbnailFile) {
      const uploadResult = await saveFile(newThumbnailFile);
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error },
          { status: 400 }
        );
      }
      updates.thumbnail_path = uploadResult.filePath!;

      // Hapus thumbnail lama jika tersimpan di /uploads/
      if (existingNews.thumbnail_path && existingNews.thumbnail_path.startsWith("/uploads/")) {
        await deleteFile(existingNews.thumbnail_path);
      }
    } else if (explicitThumbnailPath) {
      updates.thumbnail_path = explicitThumbnailPath;
    }

    const updated = await db.update<NewsRecord>("News", id, updates);

    return NextResponse.json({
      success: true,
      message: `Berita "${updated.title}" berhasil diperbarui.`,
      news: updated,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui berita: " + err.message },
      { status }
    );
  }
}

// DELETE /api/admin/news - Menghapus berita
export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID berita wajib disertakan." },
        { status: 400 }
      );
    }

    const targetNews = await db.get<NewsRecord>("News", "id", id);
    if (!targetNews) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hapus file thumbnail jika tersimpan secara lokal di folder /uploads/
    if (targetNews.thumbnail_path && targetNews.thumbnail_path.startsWith("/uploads/")) {
      await deleteFile(targetNews.thumbnail_path);
    }

    await db.delete("News", id);

    return NextResponse.json({
      success: true,
      message: `Berita "${targetNews.title}" berhasil dihapus.`,
    });
  } catch (err: any) {
    const status = err.message === "FORBIDDEN" ? 403 : err.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { success: false, error: "Gagal menghapus berita: " + err.message },
      { status }
    );
  }
}
