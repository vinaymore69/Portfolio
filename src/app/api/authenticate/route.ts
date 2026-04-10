import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseServer";

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const TABLE_NAME = "client_users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Fetch user from Supabase
    const { data: userConfig, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .select("username, email, password_hash, folder_id, display_name")
      .or(`username.ilike.${username},email.ilike.${username}`)
      .single();

    if (error || !userConfig) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, userConfig.password_hash);
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        username: userConfig.username,
        folderId: userConfig.folder_id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
      },
      JWT_SECRET
    );

    const response = NextResponse.json({ 
      success: true, 
      user: {
        username: userConfig.username,
        displayName: userConfig.display_name
      }
    }, { status: 200 });

    // Set authentication cookie specific to this user
    response.headers.set(
      "Set-Cookie",
      cookie.serialize(`auth-${userConfig.username}`, token, {
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
