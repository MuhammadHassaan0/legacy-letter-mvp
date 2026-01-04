import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!process.env.ADMIN_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_TOKEN not set" },
      { status: 500 }
    );
  }

  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const emails = (await kv.smembers("legacy:email_intents:set")) as string[];

  return NextResponse.json({
    ok: true,
    count: emails.length,
    data: emails.sort(),
  });
}

