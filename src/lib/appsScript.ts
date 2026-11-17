import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  variant?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderRecord {
  id: string;
  ticket_code: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: string; // JSON serialized string of OrderItem[]
  total_amount: number;
  notes: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  cancel_reason?: string;
  created_at: string;
  updated_at: string;
}

// Path penyimpanan database lokal saat Apps Script belum dihubungkan
const LOCAL_DB_DIR = path.join(process.cwd(), ".data");
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, "db.json");

interface LocalDatabase {
  Roles: RoleRecord[];
  Users: UserRecord[];
  News: NewsRecord[];
  Orders: OrderRecord[];
}

const DEFAULT_DB: LocalDatabase = {
  Roles: [
    {
      id: "role-admin-01",
      name: "admin",
      description: "Administrator sistem dengan akses penuh ke seluruh manajemen data",
      permissions: "*",
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role-user-01",
      name: "user",
      description: "Customer terdaftar yang dapat memesan produk dan memantau status pesanan",
      permissions: "order:create,order:read_own",
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "user-admin-01",
      name: "Administrator Ricake",
      email: "admin@gmail.com",
      // Bcrypt hash dari "123456"
      password_hash: "$2b$10$7D56pkdeocGbQoG7s/xS9OI7kfyAQ7kDxeS9TkulumXuropndTy.e",
      role_id: "role-admin-01",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "news-01",
      title: "Meet Ricake: A Little Homemade Happiness",
      slug: "meet-ricake-a-little-homemade-happiness",
      excerpt: "Kenali Ricake, brand homemade yang menghadirkan churros frozen, aneka bolu, brownies, dan soft cookies untuk menemani momen manismu.",
      content: "Ricake berawal dari kecintaan memanggang kue di dapur rumah. Dengan bahan-bahan berkualitas pilihan dan kehangatan tangan, setiap sajian dibuat dalam batch kecil untuk menjaga kesegaran dan cita rasa terbaik.",
      thumbnail_path: "/images/hero-bakes.jpg",
      status: "published",
      author_id: "user-admin-01",
      created_at: "2024-10-12T08:00:00.000Z",
      updated_at: "2024-10-12T08:00:00.000Z",
    },
    {
      id: "news-02",
      title: "Churros Frozen: Your Favorite Treat, Ready When You Are",
      slug: "churros-frozen-ready-when-you-are",
      excerpt: "Kenali pilihan rasa Churros Frozen Ricake dan cara menikmati churros hangat renyah setelah digoreng di rumah bersama secangkir kopi.",
      content: "Kini menikmati churros renyah dengan lelehan saus cokelat tidak perlu keluar rumah. Cukup simpan Churros Frozen Ricake di freezer, lalu goreng selama 2-3 menit pada minyak panas kapan saja kamu menginginkannya.",
      thumbnail_path: "/images/products/churros.jpg",
      status: "published",
      author_id: "user-admin-01",
      created_at: "2024-09-28T09:30:00.000Z",
      updated_at: "2024-09-28T09:30:00.000Z",
    },
    {
      id: "news-03",
      title: "Make Your Moment Sweeter with a Custom Cake",
      slug: "make-your-moment-sweeter-with-custom-cake",
      excerpt: "Dari bolu keju hingga bolu cokelat, cari tahu pilihan pesanan bolu custom yang bisa kamu tanyakan kepada Ricake untuk acara keluarga.",
      content: "Rayakan hari-hari spesialmu dengan aneka bolu buatan rumah dari Ricake. Tersedia pilihan Bolu Keju Melimpah, Bolu Pisang Wangi, hingga Bolu Cokelat Lembut dengan topper kustom sesuai kebutuhan acaramu.",
      thumbnail_path: "/images/products/bolu.jpg",
      status: "published",
      author_id: "user-admin-01",
      created_at: "2024-09-15T14:15:00.000Z",
      updated_at: "2024-09-15T14:15:00.000Z",
    },
  ],
  Orders: [],
};

async function getLocalDb(): Promise<LocalDatabase> {
  try {
    await fs.mkdir(LOCAL_DB_DIR, { recursive: true });
    const content = await fs.readFile(LOCAL_DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.Orders) parsed.Orders = [];
    return parsed;
  } catch {
    await fs.mkdir(LOCAL_DB_DIR, { recursive: true });
    await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
    return DEFAULT_DB;
  }
}

async function saveLocalDb(db: LocalDatabase): Promise<void> {
  await fs.mkdir(LOCAL_DB_DIR, { recursive: true });
  await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

type TableName = "Roles" | "Users" | "News" | "Orders";

/**
 * Driver Google Apps Script / Local Database Adapter
 */
export const db = {
  isConfigured(): boolean {
    return !!(process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_SECRET);
  },

  async list<T>(table: TableName): Promise<T[]> {
    if (this.isConfigured()) {
      const url = new URL(process.env.APPS_SCRIPT_URL!);
      url.searchParams.set("action", "list");
      url.searchParams.set("table", table);
      url.searchParams.set("secret", process.env.APPS_SCRIPT_SECRET!);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal mengambil data dari Google Apps Script.");
      return json.data as T[];
    }

    const localDb = await getLocalDb();
    return (localDb[table] || []) as T[];
  },

  async get<T>(table: TableName, field: string, value: string): Promise<T | null> {
    if (this.isConfigured()) {
      const url = new URL(process.env.APPS_SCRIPT_URL!);
      url.searchParams.set("action", "get");
      url.searchParams.set("table", table);
      url.searchParams.set("field", field);
      url.searchParams.set("value", value);
      url.searchParams.set("secret", process.env.APPS_SCRIPT_SECRET!);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const json = await res.json();
      if (!json.success) return null;
      return json.data as T;
    }

    const list = await this.list<any>(table);
    const item = list.find((row) => String(row[field]) === String(value));
    return item ? (item as T) : null;
  },

  async create<T>(table: TableName, data: Partial<T>): Promise<T> {
    const record: any = {
      id: (data as any).id || `${table.toLowerCase()}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (this.isConfigured()) {
      const res = await fetch(process.env.APPS_SCRIPT_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          table,
          data: record,
          secret: process.env.APPS_SCRIPT_SECRET!,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal menyimpan data ke Google Apps Script.");
      return json.data as T;
    }

    const localDb = await getLocalDb();
    if (!localDb[table]) localDb[table] = [] as any;
    (localDb[table] as any[]).push(record);
    await saveLocalDb(localDb);
    return record as T;
  },

  async update<T>(table: TableName, id: string, data: Partial<T>): Promise<T> {
    if (this.isConfigured()) {
      const res = await fetch(process.env.APPS_SCRIPT_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          table,
          id,
          data,
          secret: process.env.APPS_SCRIPT_SECRET!,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memperbarui data di Google Apps Script.");
      return json.data as T;
    }

    const localDb = await getLocalDb();
    if (!localDb[table]) localDb[table] = [] as any;
    const rows = localDb[table] as any[];
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Data dengan ID ${id} tidak ditemukan.`);

    rows[idx] = {
      ...rows[idx],
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };

    await saveLocalDb(localDb);
    return rows[idx] as T;
  },

  async delete(table: TableName, id: string): Promise<boolean> {
    if (this.isConfigured()) {
      const res = await fetch(process.env.APPS_SCRIPT_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          table,
          id,
          secret: process.env.APPS_SCRIPT_SECRET!,
        }),
      });

      const json = await res.json();
      return json.success === true;
    }

    const localDb = await getLocalDb();
    if (!localDb[table]) return false;
    const rows = localDb[table] as any[];
    const filtered = rows.filter((r) => r.id !== id);
    if (filtered.length === rows.length) return false;

    localDb[table] = filtered as any;
    await saveLocalDb(localDb);
    return true;
  },
};
