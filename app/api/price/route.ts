import { NextResponse } from "next/server";

// Constants
const JOYALUKKAS_GRAPHQL_ENDPOINT = "https://www.joyalukkas.in/graphql";
const TARGET_BRANCH_CODE = "TRY"; // Trichy

const GET_GOLD_RATES_QUERY = `
  query getgoldrates {
    getgoldrates {
      Data {
        BRANCH_CODE
        BRANCH_NAME
        GOLD_14KT_RATE
        GOLD_18KT_RATE
        GOLD_22KT_RATE
        GOLD_24KT_RATE
        SILVER_RATE
        PLATINUM_RATE
        __typename
      }
    }
  }
`;

/**
 * Standard GET handler for fetching market rates
 * Caches results for 1 hour to optimize performance and prevent API rate-limiting
 */
export async function GET() {
  try {
    const response = await fetch(JOYALUKKAS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        operationName: "getgoldrates",
        query: GET_GOLD_RATES_QUERY,
        variables: {},
      }),
      // Next.js Data Cache: Revalidate every 3600 seconds (1 hour)
      // next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Upstream API responded with status: ${response.status}`);
    }

    const payload = await response.json();
    const branchData = payload.data?.getgoldrates?.Data || [];

    // Filter specifically for Trichy
    const trichyRates = branchData.find(
      (branch: any) => branch.BRANCH_CODE === TARGET_BRANCH_CODE
    );

    if (!trichyRates) {
      return NextResponse.json(
        { success: false, error: `Branch ${TARGET_BRANCH_CODE} not found.` },
        { status: 404 }
      );
    }

    // Professional clean response structure
    return NextResponse.json({
      success: true,
      data: {
        rates: {
          gold_14k: parseFloat(trichyRates.GOLD_14KT_RATE),
          gold_18k: parseFloat(trichyRates.GOLD_18KT_RATE),
          gold_22k: parseFloat(trichyRates.GOLD_22KT_RATE),
          gold_24k: parseFloat(trichyRates.GOLD_24KT_RATE),
          silver: parseFloat(trichyRates.SILVER_RATE),
          platinum: parseFloat(trichyRates.PLATINUM_RATE),
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