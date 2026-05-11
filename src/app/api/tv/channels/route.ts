import { NextResponse } from 'next/server';
import { getTVChannels } from '@/app/actions/tv';

export async function GET() {
  try {
    const channels = await getTVChannels();
    return NextResponse.json(channels);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar canais' }, { status: 500 });
  }
}
