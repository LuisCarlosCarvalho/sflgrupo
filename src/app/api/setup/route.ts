import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 1. Upsert ADMIN
    const { data: adminUser, error: adminError } = await supabase
      .from('User')
      .upsert({
        email: "brasilviptv@gmail.com",
        username: "Admin",
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        planType: "PREMIUM",
        name: "SFL Admin"
      }, { onConflict: 'email' })
      .select()
      .single();

    if (adminError) throw adminError;

    // 2. Upsert Usuário TESTE
    const { data: testUser, error: testError } = await supabase
      .from('User')
      .upsert({
        email: "teste@teste.com",
        username: "teste",
        password: hashedPassword,
        role: "USER",
        isActive: false,
        planType: "FREE",
        name: "Usuário Teste"
      }, { onConflict: 'email' })
      .select()
      .single();

    if (testError) throw testError;

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
