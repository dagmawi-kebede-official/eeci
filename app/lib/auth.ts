import "server-only";
import { headers } from "next/headers";
import { betterAuthInstance } from "@/lib/better-auth";
import { ensureDatabaseReady } from "@/lib/db-readiness";

export interface CurrentUser {
  userId: string;
  email: string;
  name: string;
}

async function currentUserFromHeaders(
  requestHeaders: Headers
): Promise<CurrentUser | null> {

  await ensureDatabaseReady();

  const session = await betterAuthInstance.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return null;
  }

  const userId = String(session.user.id);

  if (!userId) {
    return null;
  }

  return {
    userId,
    email: session.user.email,
    name: session.user.name,
  };
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return currentUserFromHeaders(await headers());
}

export async function getCurrentUserFromRequest(
  request: Request
): Promise<CurrentUser | null> {
  return currentUserFromHeaders(request.headers);
}
