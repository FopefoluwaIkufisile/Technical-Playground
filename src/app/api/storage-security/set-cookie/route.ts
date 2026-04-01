import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, httpOnly = true, sameSite = "strict" } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "secure_auth_token",
      value: token,
      httpOnly,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSite as any,
      maxAge: 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Secure cookie set." });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
