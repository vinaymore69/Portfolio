import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseAuthVerifier } from "@/lib/supabaseServer";

const TABLE_NAME = "drive_users";

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
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error("GET /api/drive-users failed", error);
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
      email?: string;
      fullName?: string;
      role?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const fullName = body.fullName?.trim();
    const role = body.role?.trim() || "member";

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "email and fullName are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert({ email, full_name: fullName, role, created_by: user.id })
      .select("id, email, full_name, role, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/drive-users failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
