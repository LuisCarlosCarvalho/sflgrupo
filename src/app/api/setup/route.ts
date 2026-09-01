import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminPasswordHash = await bcrypt.hash("Admin@SFL2026", 10);
    const testUserPasswordHash = await bcrypt.hash("User@SFL2026", 10);

    const admin = await prisma.user.upsert({
      where: { email: "admin@sflgrupo.store" },
      update: {},
      create: {
        email: "admin@sflgrupo.store",
        name: "Administrador SFL",
        role: "ADMIN",
        status: "ACTIVE",
        plan: "VIP",
        passwordHash: adminPasswordHash,
      },
    });

    await prisma.user.upsert({
      where: { email: "teste@sflgrupo.store" },
      update: {},
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
      message: "Banco inicializado com sucesso!",
      adminEmail: admin.email,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
