import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = "access-secret";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, ACCESS_SECRET);

    return NextResponse.json({
      message: "✅ Success! Valid access token.",
      data: { secretData: "This is locked behind the Access Token." }
    });
  } catch (err) {
    return NextResponse.json(
      { error: "❌ Access token expired or invalid." },
      { status: 401 }
    );
  }
}
