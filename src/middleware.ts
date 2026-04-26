import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Log para debug no servidor (você verá isso no console onde roda o npm run dev)
    if (isAdminRoute) {
      console.log("🛡️ Middleware Admin Check:", {
        path: req.nextUrl.pathname,
        hasToken: !!token,
        role: token?.role
      });
    }

    if (isAdminRoute && token?.role?.toString().toUpperCase() !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
