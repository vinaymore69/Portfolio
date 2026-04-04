import { NextResponse } from "next/server";

const COUNTER_WORKSPACE = process.env.COUNTER_WORKSPACE || "vinay-mores-team-3526";
const COUNTER_NAME = process.env.COUNTER_NAME || "vinay69";
const COUNTER_TOKEN = process.env.COUNTER_API_TOKEN;
const FALLBACK_NAMESPACE = process.env.COUNTER_FALLBACK_NAMESPACE || "vinaymore69";
const FALLBACK_COUNTER_NAME = process.env.COUNTER_FALLBACK_NAME || "visits";

function extractCount(data: Record<string, unknown>) {
  if (typeof data.count === "number") return data.count;
  if (typeof data.value === "number") return data.value;
  if (typeof data.data === "number") return data.data;
  return null;
}

export async function GET() {
  try {
    if (COUNTER_TOKEN) {
      const v2Response = await fetch(
        `https://api.counterapi.dev/v2/${COUNTER_WORKSPACE}/${COUNTER_NAME}/up`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${COUNTER_TOKEN}`,
          },
          cache: "no-store",
        },
      );

      if (v2Response.ok) {
        const v2Data = await v2Response.json();
        const count = extractCount(v2Data as Record<string, unknown>);
        return NextResponse.json({ count, source: "v2" }, { status: 200 });
      }
    }

    const fallbackResponse = await fetch(
      `https://api.counterapi.dev/v1/${FALLBACK_NAMESPACE}/${FALLBACK_COUNTER_NAME}/up`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!fallbackResponse.ok) {
      const errorText = await fallbackResponse.text();
      return NextResponse.json(
        { error: "Counter API request failed", details: errorText },
        { status: 502 },
      );
    }

    const fallbackData = await fallbackResponse.json();
    const count = extractCount(fallbackData as Record<string, unknown>);
    return NextResponse.json({ count, source: "v1-fallback" }, { status: 200 });
  } catch (error) {
    console.error("Counter API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to increment counter" },
      { status: 502 },
    );
  }
}
