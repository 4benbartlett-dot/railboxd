import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  const maxwidth = searchParams.get("maxwidth") ?? "800";

  if (!ref) {
    return NextResponse.json(
      { error: "photo ref is required" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      photo_reference: ref,
      maxwidth,
      key: GOOGLE_API_KEY,
    });

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?${params}`,
      { redirect: "follow" }
    );

    if (!res.ok) {
      throw new Error(`Google photo API returned ${res.status}`);
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000",
      },
    });
  } catch (err) {
    console.error("Places photo error:", err);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}
