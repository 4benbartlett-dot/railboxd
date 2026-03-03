import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/map";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists, create if not
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!profile) {
        const username =
          data.user.user_metadata?.username ||
          data.user.email?.split("@")[0] ||
          `user_${data.user.id.slice(0, 8)}`;

        await supabase.from("profiles").insert({
          id: data.user.id,
          username,
          display_name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            username,
          avatar_url: data.user.user_metadata?.avatar_url || null,
          home_city: data.user.user_metadata?.home_city || null,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
