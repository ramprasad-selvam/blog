import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      // The 'pathname' here is a string
      onBeforeGenerateToken: async (pathname: string) => {
        return {
          // allowedContentTypes: [
          //   'image/jpeg', 
          //   'image/png', 
          //   'application/pdf', 
          //   'text/plain'
          // ],
          tokenPayload: JSON.stringify({
             // Metadata can go here
          }),
          // You must return the pathname back to Vercel
          // It is the 'key' where your file will live
          pathname, 
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Server side upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message }, 
      { status: 400 }
    );
  }
}