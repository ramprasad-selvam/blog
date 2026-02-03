import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    // 1. Security Check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Fetch from your endpoint
        const response = await fetch('https://ramprasadselvam.vercel.app/api/metal');
        const json = await response.json();

        // Extract the rates from your specific JSON structure
        const { rates } = json.data;

        // 3. Upsert into Database
        await sql`
      INSERT INTO precious_metals (date, gold_24k, gold_22k, gold_18k, gold_14k, platinum, silver)
      VALUES (
        CURRENT_DATE, 
        ${rates.gold_24k}, 
        ${rates.gold_22k}, 
        ${rates.gold_18k}, 
        ${rates.gold_14k}, 
        ${rates.platinum}, 
        ${rates.silver}
      )
      ON CONFLICT (date) DO UPDATE SET 
        gold_24k = EXCLUDED.gold_24k,
        gold_22k = EXCLUDED.gold_22k,
        gold_18k = EXCLUDED.gold_18k,
        gold_14k = EXCLUDED.gold_14k,
        platinum = EXCLUDED.platinum,
        silver = EXCLUDED.silver;
    `;

        // 4. Delete data older than 90 days
        await sql`DELETE FROM precious_metals WHERE date < CURRENT_DATE - INTERVAL '90 days';`;

        return NextResponse.json({ success: true, message: "Data updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Cron execution failed' }, { status: 500 });
    }
}