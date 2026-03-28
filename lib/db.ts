import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Force IPv4 first in Node.js environments to avoid unreachable IPv6 addresses causing timeouts
if (typeof process !== "undefined" && process.release?.name === "node") {
  // Use eval('require') to hide the node-specific module from Webpack/bundlers
  try {
    const dns = eval('require("node:dns")');
    if (dns && typeof dns.setDefaultResultOrder === "function") {
      dns.setDefaultResultOrder("ipv4first");
    }
  } catch {
    // Ignore errors if node:dns is not available
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    signal: AbortSignal.timeout(60000), // 60 second timeout for cold starts
  },
});

export const db = drizzle(sql, { schema });
