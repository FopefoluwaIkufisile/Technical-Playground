import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("secure_auth_token");

  if (!token) {
    return NextResponse.json({ hasCookie: false });
  }

  return NextResponse.json({
    hasCookie: true,
    value: token.value,
  });
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("secure_auth_token");
  return NextResponse.json({ success: true, message: "Cookie cleared." });
}
