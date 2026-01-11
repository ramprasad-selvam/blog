import { renderToStream } from '@react-pdf/renderer';
import { ResumePDF } from '@/app/(profile)/portfolio/ats/ResumeTemplate';
import { NextResponse } from 'next/server';

export async function GET() {
  const stream = await renderToStream(ResumePDF());
  
  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Ramprasad_Selvam_Resume.pdf"',
    },
  });
}