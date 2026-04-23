import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 1. Upsert ADMIN
    const adminUser = await prisma.user.upsert({
      where: { email: "brasilviptv@gmail.com" },
      update: {
        username: "Admin",
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        planType: "PREMIUM",
      },
      create: {
        name: "SFL Admin",
        username: "Admin",
        email: "brasilviptv@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        planType: "PREMIUM",
      },
    });

    // 2. Upsert Usuário TESTE
    const testUser = await prisma.user.upsert({
      where: { email: "teste@teste.com" },
      update: {
        username: "teste",
        password: hashedPassword,
        role: "USER",
        isActive: false,
        planType: "FREE",
      },
      create: {
        name: "Usuário Teste",
        username: "teste",
        email: "teste@teste.com",
        password: hashedPassword,
        role: "USER",
        isActive: false,
        planType: "FREE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Setup concluído com sucesso!",
      admin: adminUser.username,
      test: testUser.username,
    });
  } catch (error: any) {
    console.error("Setup Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
