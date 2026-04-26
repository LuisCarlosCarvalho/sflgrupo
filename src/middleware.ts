import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Se for rota de admin, EXIGE o cargo ADMIN
    if (pathname.startsWith("/admin") && token?.role?.toString().toUpperCase() !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Deixa passar pelo "porteiro" inicial, a lógica acima decide se barra ou não
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
