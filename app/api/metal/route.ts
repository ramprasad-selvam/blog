import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.lalithaajewellery.com/public/pricings/latest?state_id=df30f5aa-75b6-4766-8317-25cf4eaf43a6", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream API responded with status: ${response.status}`);
    }

    const payload = await response.json();
    const prices = payload.data?.prices;
    if (!prices) {
      return NextResponse.json(
        { success: false, error: `No data found.` },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: {
        rates: {
          gold_24k: prices.gold_24kt.price,
          gold_22k: prices.gold_22kt.price,
          silver: prices.silver.price,
          platinum: prices.platinum.price,
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
