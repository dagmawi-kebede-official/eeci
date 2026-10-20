import "server-only";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL =
  process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

if (!secret || Buffer.byteLength(secret) < 32) {
  throw new Error(
    "BETTER_AUTH_SECRET must be set and contain at least 32 bytes."
  );
}

export const betterAuthInstance = betterAuth({
  appName: "EECI",
  baseURL,
  secret,

  trustedOrigins: [baseURL],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,

    password: {
      hash: async (password) => {
        return bcrypt.hash(password, 10);
      },

      verify: async ({ hash, password }) => {
        return bcrypt.compare(password, hash);
      },
    },
  },

  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },
});
