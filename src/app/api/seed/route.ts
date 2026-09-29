import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const adminPasswordHash = await bcrypt.hash("S@l798412", 10);
    const testUserPasswordHash = await bcrypt.hash("User@SFL2026", 10);

    const admin = await prisma.user.upsert({
      where: { email: "brasilviptv@gmail.com" },
      update: {
        role: "ADMIN",
        status: "ACTIVE",
        plan: "VIP",
        passwordHash: adminPasswordHash,
      },
      create: {
        email: "brasilviptv@gmail.com",
        name: "Administrador SFL",
        role: "ADMIN",
        status: "ACTIVE",
        plan: "VIP",
        passwordHash: adminPasswordHash,
      },
    });

    const testUser = await prisma.user.upsert({
      where: { email: "teste@sflgrupo.store" },
      update: {
        status: "ACTIVE",
        plan: "PRO",
        passwordHash: testUserPasswordHash,
      },
      create: {
        email: "teste@sflgrupo.store",
        name: "Usuário Teste",
        role: "USER",
        status: "ACTIVE",
        plan: "PRO",
        passwordHash: testUserPasswordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seed concluído com sucesso!",
      users: { admin: admin.email, test: testUser.email },
    });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro desconhecido" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
