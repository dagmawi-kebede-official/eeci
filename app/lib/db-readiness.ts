import "server-only";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 6;
const CACHE_MS = 4 * 60 * 1000;

let readyUntil = 0;
let pendingCheck: Promise<void> | undefined;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const RETRY_DELAYS_MS = [
  500,
  1_000,
  2_000,
  4_000,
  5_000,
  5_000,
  5_000,
  5_000,
  5_000,
  5_000,
  5_000,
] as const;

async function probeWithRetry(): Promise<void> {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= RETRY_DELAYS_MS.length;
    attempt++
  ) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch (error) {
      lastError = error;

      if (attempt === RETRY_DELAYS_MS.length) {
        break;
      }

      const delay = RETRY_DELAYS_MS[attempt];

      console.warn(
        `[db-readiness] Connection check ${attempt + 1}/12 failed. ` +
          `Retrying in ${delay}ms.`,
      );

      await sleep(delay);
    }
  }

  console.error(
    "[db-readiness] Database unavailable after 12 attempts.",
    lastError,
  );

  throw lastError;
}

export async function ensureDatabaseReady(): Promise<void> {
  if (Date.now() < readyUntil) return;

  if (!pendingCheck) {
    pendingCheck = probeWithRetry()
      .then(() => {
        readyUntil = Date.now() + CACHE_MS;
      })
      .finally(() => {
        pendingCheck = undefined;
      });
  }

  await pendingCheck;
}
