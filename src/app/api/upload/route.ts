import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB (Vercel serverless body limit safe)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Arquivo excede o limite de 4 MB para upload direto. Use o campo de URL externa para arquivos maiores." },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saved = await prisma.uploadedFile.create({
      data: {
        filename: file.name || "arquivo",
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        data: buffer,
      },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
      },
    });

    return NextResponse.json({
      id: saved.id,
      url: `/api/files/${saved.id}`,
      filename: saved.filename,
      mimeType: saved.mimeType,
      size: saved.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erro interno ao salvar arquivo." }, { status: 500 });
  }
}

