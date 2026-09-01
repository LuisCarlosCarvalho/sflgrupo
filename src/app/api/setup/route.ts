import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminPasswordHash = await bcrypt.hash("S@l798412", 10);
    const testUserPasswordHash = await bcrypt.hash("User@SFL2026", 10);

    // Upsert Admin Principal
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

    // Upsert Admin secundário / legado
    await prisma.user.upsert({
      where: { email: "admin@sflgrupo.store" },
      update: {
        role: "ADMIN",
        status: "ACTIVE",
        plan: "VIP",
        passwordHash: adminPasswordHash,
      },
      create: {
        email: "admin@sflgrupo.store",
        name: "Administrador SFL",
        role: "ADMIN",
        status: "ACTIVE",
        plan: "VIP",
        passwordHash: adminPasswordHash,
      },
    });

    // Upsert Usuário Teste
    await prisma.user.upsert({
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

    const channelCount = await prisma.tVChannel.count();
    if (channelCount === 0) {
      const channel1 = await prisma.tVChannel.create({
        data: {
          channelNum: "001",
          name: "RECORD SP HD¹",
          logoUrl: "https://upload.wikimedia.org/wikipedia/pt/7/77/RecordTV_2016.png",
          streamUrl: "https://stream.sflgrupo.store/live/record.m3u8",
          category: "ABERTOS",
        },
      });

      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      await prisma.tVProgram.create({
        data: {
          channelId: channel1.id,
          title: "Jornal da Record",
          description: "Noticiário nacional e internacional com reportagens exclusivas.",
          startTime: now,
          endTime: oneHourLater,
          isLive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Usuário administrativo configurado com sucesso!",
      admin: admin.email,
      role: admin.role,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
