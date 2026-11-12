import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    const platform = await prisma.homePlatform.findUnique({
      where: { shortCode: code },
      select: { fileUrl: true, active: true },
    });

    if (!platform || !platform.fileUrl) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const target = platform.fileUrl.startsWith("/")
      ? new URL(platform.fileUrl, req.url)
      : platform.fileUrl;

    return NextResponse.redirect(target);
  } catch (error) {
    console.error("Short link redirect error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

