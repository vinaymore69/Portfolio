import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ authenticated: false }, { status: 400 });
    }

    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader);
    const token = cookies[`auth-${username}`];

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check if token is for the correct user
      if (decoded.username !== username) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      return NextResponse.json({ 
        authenticated: true,
        user: {
          username: decoded.username,
          folderId: decoded.folderId
        }
      }, { status: 200 });
    } catch (jwtError) {
      // Token is invalid or expired
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Check auth error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// Keep GET method for backward compatibility
export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookie.parse(cookieHeader);

  // Check for old-style auth token
  if (cookies.authToken === "authenticated") {
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
