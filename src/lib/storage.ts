import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Batas ukuran file: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Format file yang diizinkan
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Menyimpan file media secara lokal ke folder public/uploads/
 * @param file File objek dari FormData
 */
export async function saveFile(file: File): Promise<SaveFileResult> {
  try {
    if (!file || file.size === 0) {
      return { success: false, error: "File tidak boleh kosong." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file maksimal adalah 5MB." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: "Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP." };
    }

    // Pastikan folder uploads ada
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Dapatkan ekstensi file
    const ext = path.extname(file.name) || (file.type === "image/png" ? ".png" : ".jpg");
    // Generate nama file acak yang unik dan aman
    const uniqueName = `ricake-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext.toLowerCase()}`;
    const destination = path.join(UPLOAD_DIR, uniqueName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(destination, buffer);

    return {
      success: true,
      filePath: `/uploads/${uniqueName}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Gagal menyimpan file: ${err.message}`,
    };
  }
}

/**
 * Menghapus file media dari folder public/uploads/
 * @param relativePath Path relatif (misal: /uploads/ricake-xxx.jpg)
 */
export async function deleteFile(relativePath: string): Promise<boolean> {
  try {
    if (!relativePath || !relativePath.startsWith("/uploads/")) {
      return false;
    }
    const filename = path.basename(relativePath);
    const fullPath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(fullPath);
    return true;
  } catch {
    return false;
  }
}
