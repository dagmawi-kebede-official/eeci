import { toNextJsHandler } from "better-auth/next-js";
import { betterAuthInstance } from "@/lib/better-auth";
import { ensureDatabaseReady } from "@/lib/db-readiness";

const handlers = toNextJsHandler(betterAuthInstance);

async function prepareDatabase(): Promise<Response | null> {
  try {
    await ensureDatabaseReady();
    return null;
  } catch (error) {
    console.error("[auth] Database readiness check failed:", error);

    return Response.json(
      { message: "Authentication is temporarily unavailable." },
      {
        status: 503,
        headers: { "Retry-After": "2" },
      },
    );
  }
}

export async function GET(request: Request) {
  const unavailable = await prepareDatabase();
  if (unavailable) return unavailable;

  return handlers.GET(request);
}

export async function POST(request: Request) {
  const unavailable = await prepareDatabase();
  if (unavailable) return unavailable;

  return handlers.POST(request);
}
