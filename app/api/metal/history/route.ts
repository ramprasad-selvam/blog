import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { unstable_cache } from 'next/cache';

const getCachedMetals = unstable_cache(
  async () => {
    const { rows } = await sql`
      SELECT date, gold_24k, gold_22k, gold_18k, gold_14k, platinum, silver 
      FROM precious_metals 
      ORDER BY date ASC
    `;
    return rows;
  },
  ['precious-metals-query'],
  { tags: ['precious-metals-data'] } 
);

export async function GET() {
  try {
    const cachedRows = await getCachedMetals();

    return NextResponse.json({
      success: true,
      data: cachedRows
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}