import "server-only";
import { 
  type SessionUser 
} from "./session";

export { type SessionUser };

import { cookies } from "next/headers";

// ─── Auth actions ────────────────────────────────────────────

export async function getSession(): Promise<SessionUser | null> {
  // Use a guest-id cookie set by the client to identify the "local" session
  const guestId = (await cookies()).get("guest-id")?.value;
  const guestName = (await cookies()).get("guest-name")?.value || "Guest User";
  
  if (!guestId) return null;

  return {
    id: guestId,
    email: "guest@example.com",
    name: guestName,
  };
}
