import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = "access-secret";
const REFRESH_SECRET = "refresh-secret";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: string;
    };

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: "admin", iat: Math.floor(Date.now() / 1000) },
      ACCESS_SECRET,
      { expiresIn: "60s" }
    );

    return NextResponse.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "❌ Refresh token expired. Please log in again." },
      { status: 401 }
    );
  }
}
