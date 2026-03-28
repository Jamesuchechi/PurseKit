import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { historyItems } from "@/lib/schema";
import { getSession } from "@/lib/auth";

const SaveHistoryItemSchema = z.object({
  module: z.enum(["devlens", "specforge", "chartgpt"]),
  title: z.string().min(1).max(200),
  input: z.string().min(1),
  result: z.unknown(),
});

// GET /api/history?module=chartgpt
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const moduleFilter = searchParams.get("module") as "devlens" | "specforge" | "chartgpt" | null;

  const rows = await db
    .select()
    .from(historyItems)
    .where(
      moduleFilter
        ? and(eq(historyItems.userId, session.id), eq(historyItems.module, moduleFilter))
        : eq(historyItems.userId, session.id)
    )
    .orderBy(desc(historyItems.createdAt))
    .limit(50);

  // Map DB rows to the HistoryItem shape expected by the frontend
  const items = rows.map((row) => ({
    id: row.id,
    module: row.module,
    title: row.title,
    input: row.input,
    result: row.result,
    createdAt: row.createdAt.toISOString(),
    timestamp: row.createdAt.toLocaleString(),
  }));

  return NextResponse.json(items);
}

// POST /api/history
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SaveHistoryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { module, title, input, result } = parsed.data;

  const inserted = await db
    .insert(historyItems)
    .values({
      userId: session.id,
      module,
      title,
      input,
      result: result as Record<string, unknown>,
    })
    .returning();

  const row = inserted[0];
  return NextResponse.json(
    {
      id: row.id,
      module: row.module,
      title: row.title,
      input: row.input,
      result: row.result,
      createdAt: row.createdAt.toISOString(),
      timestamp: row.createdAt.toLocaleString(),
    },
    { status: 201 }
  );
}
