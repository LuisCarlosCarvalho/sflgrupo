import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const file = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
    }

    const isImage = file.mimeType.startsWith("image/");
    const safeFilename = encodeURIComponent(file.filename).replace(/['()]/g, escape);

    return new NextResponse(Buffer.from(file.data), {
      status: 200,
      headers: {
        "Content-Type": file.mimeType || "application/octet-stream",
        "Content-Disposition": isImage
          ? `inline; filename*=UTF-8''${safeFilename}`
          : `attachment; filename*=UTF-8''${safeFilename}`,
        "Content-Length": String(file.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "Erro ao carregar arquivo." }, { status: 500 });
  }
}

