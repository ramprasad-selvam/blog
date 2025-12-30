import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get('width') || '800';
  const height = searchParams.get('height') || '600';
  const seed = Math.floor(Math.random() * 5000);
  const providers = [
    `https://picsum.photos/${width}/${height}?random=${seed}`,
    `https://loremflickr.com/${width}/${height}/abstract?lock=${seed}`,
  ];
  const selectedUrl = providers[Math.floor(Math.random() * providers.length)];
  try {
    const response = await fetch(selectedUrl);
    if (!response.ok) {
      throw new Error(`Provider failed with status: ${response.status}`);
    }
    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Image Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch random image' }, { status: 500 });
  }
}