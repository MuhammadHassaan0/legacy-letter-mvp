import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    let email = url.searchParams.get("email") || "";

    if (!email) {
      try {
        const body = await req.json();
        email = body?.email || "";
      } catch {}
    }

    email = email.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const setKey = "legacy:email_intents:set";
    const added = await kv.sadd(setKey, email);

    return NextResponse.json({
      ok: true,
      deduped: added === 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

