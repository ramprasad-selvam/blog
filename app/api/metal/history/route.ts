import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT date, gold_24k, gold_22k, gold_18k, gold_14k, platinum, silver 
      FROM precious_metals 
      ORDER BY date ASC 
      LIMIT 90
    `;
    const formattedData = rows.map(row => ({
      ...row,
      date: new Date(row.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}