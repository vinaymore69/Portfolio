import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseAuthVerifier } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

const TABLE_NAME = "client_users";

async function validateAccessToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return null;
  }

  const { data, error } = await supabaseAuthVerifier.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await validateAccessToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .select("id, username, display_name, folder_id, spreadsheet_ids, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error("GET /api/client-users failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await validateAccessToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      username?: string;
      displayName?: string;
      password?: string;
      folderId?: string;
      spreadsheetIds?: string;
    };

    const username = body.username?.trim().toLowerCase();
    const displayName = body.displayName?.trim();
    const password = body.password;
    const folderId = body.folderId?.trim() || null;
    let spreadsheetIds: string[] | null = null;
    
    if (body.spreadsheetIds?.trim()) {
      spreadsheetIds = body.spreadsheetIds.split(',').map(id => id.trim()).filter(id => id);
    }

    if (!username || !displayName || !password) {
      return NextResponse.json(
        { error: "username, displayName, and password are required" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert({ 
        username, 
        display_name: displayName, 
        password_hash: passwordHash,
        folder_id: folderId,
        spreadsheet_ids: spreadsheetIds
      })
      .select("id, username, display_name, folder_id, spreadsheet_ids, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/client-users failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await validateAccessToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      id?: string;
      username?: string;
      displayName?: string;
      password?: string;
      folderId?: string;
      spreadsheetIds?: string;
    };

    if (!body.id) {
       return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (body.username) updates.username = body.username.trim().toLowerCase();
    if (body.displayName) updates.display_name = body.displayName.trim();
    if (body.folderId !== undefined) updates.folder_id = body.folderId.trim() || null;
    
    if (body.spreadsheetIds !== undefined) {
      if (body.spreadsheetIds.trim()) {
        updates.spreadsheet_ids = body.spreadsheetIds.split(',').map(id => id.trim()).filter(id => id);
      } else {
        updates.spreadsheet_ids = null;
      }
    }

    if (body.password) {
       updates.password_hash = await bcrypt.hash(body.password, 12);
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', body.id)
      .select("id, username, display_name, folder_id, spreadsheet_ids, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/client-users failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
