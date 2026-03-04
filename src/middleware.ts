import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/adminToken";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (pathname.startsWith("/api/admin/login")) return NextResponse.next();
  if (pathname.startsWith("/api/admin/logout")) return NextResponse.next();

  const token = req.cookies.get("admin_token")?.value;
  if (!token) return redirectToLogin(req);

  try {
    await verifyAdminToken(token);
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

