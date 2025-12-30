import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = Math.min(parseInt(searchParams.get('width') || '800', 10), 2000);
  const height = Math.min(parseInt(searchParams.get('height') || '600', 10), 2000);
  const seed = Math.floor(Math.random() * 5000);
  const providers = [
    `https://picsum.photos/${width}/${height}?random=${seed}`,
    `https://loremflickr.com/${width}/${height}/abstract?lock=${seed}`,
  ];
  const selectedUrl = providers[Math.floor(Math.random() * providers.length)];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(selectedUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`Provider failed with status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Image Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch random image' }, { status: 500 });
  }
}
