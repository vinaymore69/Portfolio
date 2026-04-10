import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseServer";

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const TABLE_NAME = "client_users";

async function getAuthenticatedUsername(request: NextRequest): Promise<string | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookie.parse(cookieHeader);
  
  // Find the auth- cookie
  const authCookieName = Object.keys(cookies).find(name => name.startsWith('auth-'));
  if (!authCookieName) return null;
  
  const token = cookies[authCookieName];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && decoded.username) {
      return decoded.username;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const username = await getAuthenticatedUsername(request);
    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .select("username, email, display_name, folder_id")
      .ilike("username", username)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/user/profile failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUsername = await getAuthenticatedUsername(request);
    if (!currentUsername) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      email?: string;
      password?: string;
      folderId?: string;
    };

    const updates: Record<string, any> = {};
    if (body.email !== undefined) {
      updates.email = body.email.trim().toLowerCase() || null;
    }
    if (body.folderId !== undefined) {
      updates.folder_id = body.folderId.trim() || null;
    }

    if (body.password) {
       updates.password_hash = await bcrypt.hash(body.password, 12);
    }

    // Must have at least one field to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .update(updates)
      .ilike('username', currentUsername)
      .select("username, email, display_name, folder_id")
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation for email
        return NextResponse.json({ error: "Email is already in use by another account" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/user/profile failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
