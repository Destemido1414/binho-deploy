import "server-only";

import { cookies } from "next/headers";
import { signAdminToken, verifyAdminToken, type AdminTokenPayload } from "@/lib/adminToken";

const COOKIE_NAME = "admin_token";

export { signAdminToken, verifyAdminToken };
export type { AdminTokenPayload };

export async function getAdminFromCookies() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function setAdminCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

