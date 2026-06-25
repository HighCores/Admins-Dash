import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Retrieve the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const isAuthPage = req.nextUrl.pathname === "/";
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

  // If user is already logged in and tries to access the login page, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not logged in and tries to access the dashboard, redirect to login page
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Specify the paths where this middleware should run
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
