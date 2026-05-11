import { NextResponse } from 'next/server';
import { fetchWebNews } from '@/lib/scrapers/web-news';

export const revalidate = 600; // Cache de 10 minutos para não sobrecarregar os sites

export async function GET() {
  try {
    const articles = await fetchWebNews();
    return NextResponse.json(articles);
  } catch {
    console.error('API News Error');
    return NextResponse.json({ error: 'Falha ao buscar notícias' }, { status: 500 });
  }
}
