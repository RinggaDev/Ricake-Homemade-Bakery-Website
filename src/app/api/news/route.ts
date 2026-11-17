import { NextResponse } from "next/server";
import { db, NewsRecord } from "@/lib/appsScript";

// GET /api/news - Mengambil daftar artikel berita yang berstatus 'published' untuk umum
export async function GET() {
  try {
    const allNews = await db.list<NewsRecord>("News");
    const published = allNews.filter((n) => n.status === "published");

    published.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      news: published,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal memuat berita: " + err.message },
      { status: 500 }
    );
  }
}
