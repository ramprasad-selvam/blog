import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.lalithaajewellery.com/public/pricings/latest?state_id=df30f5aa-75b6-4766-8317-25cf4eaf43a6", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream API responded with status: ${response.status}`);
    }

    const payload = await response.json();
    const prices = payload.data?.prices;

    if (!prices) {
      return NextResponse.json(
        { success: false, error: `Branch ${TARGET_BRANCH_CODE} not found.` },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: {
        rates: {
          gold_14k: +(prices.gold.price * 0.6364).toFixed(2),
          gold_18k: +(prices.gold.price * 0.8182).toFixed(2),
          gold_22k: +prices.gold.price.toFixed(2),
          gold_24k: +(prices.gold.price * 1.0909).toFixed(2),
          silver: +prices.silver.price.toFixed(2),
          platinum: +prices.platinum.price.toFixed(2),
        }
      }
    });

  } catch (error: any) {
    console.error("[PRICE_API_ERROR]:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to fetch latest market prices."
      },
      { status: 500 }
    );
  }
}