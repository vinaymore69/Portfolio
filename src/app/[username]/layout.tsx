import type { ReactNode } from "react";
import { users } from "@/config/users";

export const dynamicParams = false;

export function generateStaticParams() {
  return users.map((user) => ({ username: user.username }));
}

export default function UsernameLayout({ children }: { children: ReactNode }) {
  return children;
}
