import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Pega o token da sessão do Next-Auth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "sflstream_super_secret_key_2024_!@#" });
  const { pathname } = req.nextUrl;

  // Se o usuário JÁ está logado e tentar acessar a página inicial ou a tela de login
  if (token && (pathname === "/" || pathname === "/login" || pathname === "/esqueci-senha")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Permite o fluxo normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/esqueci-senha"],
};
