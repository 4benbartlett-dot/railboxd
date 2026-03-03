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
  const query = searchParams.get("query");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    // Use Text Search for best results with station names
    const params = new URLSearchParams({
      query: `${query} transit station`,
      key: GOOGLE_API_KEY,
      type: "transit_station",
    });

    // Bias results toward the station's known coordinates
    if (lat && lng) {
      params.set("location", `${lat},${lng}`);
      params.set("radius", "500");
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`,
      { next: { revalidate: 86400 } } // Cache for 24h
    );

    if (!res.ok) {
      throw new Error(`Google API returned ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      // Fallback: try without "transit station" type restriction
      params.set("query", query);
      params.delete("type");
      const fallbackRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`,
        { next: { revalidate: 86400 } }
      );
      const fallbackData = await fallbackRes.json();

      if (fallbackData.status !== "OK" || !fallbackData.results?.length) {
        return NextResponse.json({ photos: [], place: null });
      }

      return formatResponse(fallbackData.results[0]);
    }

    return formatResponse(data.results[0]);
  } catch (err) {
    console.error("Places search error:", err);
    return NextResponse.json(
      { error: "Failed to search Google Places" },
      { status: 500 }
    );
  }
}

function formatResponse(place: Record<string, unknown>) {
  const photos = (place.photos as Array<Record<string, unknown>> | undefined) ?? [];

  return NextResponse.json(
    {
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      photos: photos.slice(0, 5).map((p) => ({
        photo_reference: p.photo_reference,
        width: p.width,
        height: p.height,
        attributions: p.html_attributions,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
