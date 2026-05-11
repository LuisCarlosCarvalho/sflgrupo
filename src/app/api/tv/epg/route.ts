import { NextResponse } from 'next/server';
import { getEPGData } from '@/lib/tv/epg-service';

export const revalidate = 3600; // Cache de 1 hora

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  try {
    const epgData = await getEPGData();
    
    if (channelId) {
      return NextResponse.json(epgData[channelId] || { programs: [] });
    }

    return NextResponse.json(epgData);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar EPG' }, { status: 500 });
  }
}
