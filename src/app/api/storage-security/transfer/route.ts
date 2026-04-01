import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("secure_auth_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No session cookie found." }, { status: 401 });
  }

  return NextResponse.json({
    message: `✅ Transfer of $1,000,000 successful! Authorized by token: ${token.value.substring(0, 5)}...`,
  });
}
