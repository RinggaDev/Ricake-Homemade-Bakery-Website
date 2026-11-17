import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { db, UserRecord, RoleRecord } from "./appsScript";

const COOKIE_NAME = "ricake_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "ricake_default_secret_key_change_in_production_12345678"
);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  roleId: string;
}

/**
 * Hash password dengan bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Verifikasi password dengan hash tersimpan
 */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Membuat token JWT dan menyimpannya di cookie httpOnly
 */
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  });

  return token;
}

/**
 * Membaca dan memverifikasi sesi aktif dari cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookie = cookies().get(COOKIE_NAME);
    if (!cookie || !cookie.value) return null;

    const { payload } = await jwtVerify(cookie.value, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Menghapus sesi / Logout
 */
export async function clearSession(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}

/**
 * Guard: Memastikan request memiliki sesi terautentikasi
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Guard: Memastikan request adalah akun dengan role 'admin'
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
