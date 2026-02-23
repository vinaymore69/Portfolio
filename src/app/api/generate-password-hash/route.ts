import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 12);
    return NextResponse.json({ hash });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate hash" }, { status: 500 });
  }
}
