export const dynamic = 'force-dynamic'; // CRITICAL FIX

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("Auth mismatch. Check your CRON_SECRET.");
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const response = await fetch('https://ramprasadselvam.vercel.app/api/metal');
    const json = await response.json();
    const { rates } = json.data;

    console.log("Fetched Rates:", rates); // This will show in Vercel Logs

    const result = await sql`
      INSERT INTO precious_metals (date, gold_24k, gold_22k, gold_18k, gold_14k, platinum, silver)
      VALUES (CURRENT_DATE, ${rates.gold_24k}, ${rates.gold_22k}, ${rates.gold_18k}, ${rates.gold_14k}, ${rates.platinum}, ${rates.silver})
      ON CONFLICT (date) DO UPDATE SET 
        gold_24k = EXCLUDED.gold_24k,
        gold_22k = EXCLUDED.gold_22k,
        gold_18k = EXCLUDED.gold_18k,
        gold_14k = EXCLUDED.gold_14k,
        platinum = EXCLUDED.platinum,
        silver = EXCLUDED.silver
      RETURNING *;
    `;

    console.log("DB Result:", result.rows);

    await sql`
      DELETE FROM precious_metals
      WHERE date NOT IN (
        SELECT date FROM precious_metals
        ORDER BY date DESC
        LIMIT 90
      );
    `;
    return NextResponse.json({ success: true, data: result.rows });

  } catch (error) {
    console.error("Detailed Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}