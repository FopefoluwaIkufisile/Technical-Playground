import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = "access-secret";
const REFRESH_SECRET = "refresh-secret";

export async function GET() {
  const accessToken = jwt.sign(
    { userId: "123", role: "admin", iat: Math.floor(Date.now() / 1000) },
    ACCESS_SECRET,
    { expiresIn: "60s" } 
  );

  const refreshToken = jwt.sign(
    { userId: "123", iat: Math.floor(Date.now() / 1000) },
    REFRESH_SECRET,
    { expiresIn: "240s" }
  );

  return NextResponse.json({
    accessToken,
    refreshToken,
  });
}
