import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // Se tentar acessar admin e não for admin, manda pra home ou login
    if (isAdminPage && token?.role?.toString().toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
