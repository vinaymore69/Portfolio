import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import { validateUser, getUserConfig } from '../../../config/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Validate user credentials
    const isValid = await validateUser(username, password);
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Get user config to include in token
    const userConfig = getUserConfig(username);
    if (!userConfig) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        username: userConfig.username,
        folderId: userConfig.folderId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
      },
      JWT_SECRET
    );

    const response = NextResponse.json({ 
      success: true, 
      user: {
        username: userConfig.username,
        displayName: userConfig.displayName
      }
    }, { status: 200 });

    // Set authentication cookie specific to this user
    response.headers.set(
      "Set-Cookie",
      cookie.serialize(`auth-${username}`, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        sameSite: "strict",
        path: "/",
      }),
    );

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
