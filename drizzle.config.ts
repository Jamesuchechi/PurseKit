import "dotenv/config";
import type { Config } from "drizzle-kit";

// Use the direct URL for migrations to avoid pooler introspection issues
const directUrl = process.env.DATABASE_URL!.replace("-pooler", "");

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: directUrl,
  },
} satisfies Config;
