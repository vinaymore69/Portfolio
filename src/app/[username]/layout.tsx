import type { ReactNode } from "react";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamicParams = true; // We want it to be dynamic but pre-cache the known usernames

export async function generateStaticParams() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('client_users')
      .select('username');

    if (error || !users) {
      console.error("Failed to fetch users for static params:", error);
      return [];
    }

    return users.map((user) => ({
      username: user.username,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default function UserPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Add a nice global style for portal if needed, otherwise just return children
  return children;
}
