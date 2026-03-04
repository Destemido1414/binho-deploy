import "server-only";

import { getAdminFromCookies } from "@/lib/adminAuth";

export async function requireAdmin() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

