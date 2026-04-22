import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Força a rota a ser dinâmica para evitar que o Prisma rode no build estático
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Iniciando setup de usuários no Supabase...");

    const adminPassword = await bcrypt.hash("S@l798412", 10);
    const userPassword = await bcrypt.hash("1234", 10);

    // 1. Criar Admin
    await prisma.user.upsert({
      where: { email: "brasilviptv@gmail.com" },
      update: {
        password: adminPassword,
        isActive: true,
        planType: "PREMIUM",
      },
      create: {
        name: "Admin SFL",
        email: "brasilviptv@gmail.com",
        password: adminPassword,
        isActive: true,
        planType: "PREMIUM",
      },
    });

    // 2. Criar Usuário Teste
    await prisma.user.upsert({
      where: { email: "user@teste.com" },
      update: {
        password: userPassword,
        isActive: false, 
        planType: "FREE",
      },
      create: {
        name: "Usuário Teste",
        email: "user@teste.com",
        password: userPassword,
        isActive: false,
        planType: "FREE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Setup concluído! Admin e Usuário Teste criados no Supabase.",
    });
  } catch (error: any) {
    console.error("Erro no setup:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
