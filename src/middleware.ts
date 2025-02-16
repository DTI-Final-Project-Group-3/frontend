import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/api/auth", "/favicon", "/icons", "/images"];

const PROTECTED_PATHS = [
    "/user",
    "/admin",
  ];

const ROLE_PATHS = {
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
    return ROLE_PATHS[userRole]?.some((path) => pathname.startsWith(path)) ?? false;
}

export async function middleware(request: Request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = new URL(request.url);

  if ((pathname === "/") || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = token.role;

  if (isProtectedPath(pathname) && !hasRequiredRole(userRole, pathname)) {
    console.log(`Unauthorized access detected for ${pathname}, redirecting`);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply middleware to all pages except static assets
  };