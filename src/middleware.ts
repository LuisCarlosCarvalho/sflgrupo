import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname } = req.nextUrl;

  // Proteção das rotas /admin
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      console.log('Middleware: Acesso negado. Token:', !!token, 'Role:', token?.role);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Configurações do middleware: aplicar apenas ao caminho /admin/*
export const config = {
  matcher: ['/admin/:path*'],
};
