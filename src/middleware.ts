import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/api/auth",
  "/favicon",
  "/icons",
  "/images",
  "/product",
];

const PROTECTED_PATHS = ["/cart", "/order-list", "/admin"];

type UserRole = "CUSTOMER_VERIFIED" | "ADMIN_WAREHOUSE" | "ADMIN_SUPER";

const ROLE_PATHS: Record<UserRole, string[]> = {
  CUSTOMER_VERIFIED: ["/cart", "/order-list"],
  ADMIN_WAREHOUSE: ["/admin"],
  ADMIN_SUPER: ["/admin"],
};

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function hasRequiredRole(userRole: string, pathname: string) {
  return (
    ROLE_PATHS[userRole as UserRole]?.some((path: string) =>
      pathname.startsWith(path)
    ) ?? false
  );
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = new URL(request.url);

  if (pathname === "/" || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = token.role;

  // Force ADMIN_SUPER & ADMIN_WAREHOUSE users to always go to /admin
  if ((userRole === "ADMIN_SUPER" || userRole === "ADMIN_WAREHOUSE") && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isProtectedPath(pathname) && !hasRequiredRole(userRole, pathname)) {
    console.log(`Unauthorized access detected for ${pathname}, redirecting`);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply middleware to all pages except static assets
};
