import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { historyItems } from "@/lib/schema";
import { getSession } from "@/lib/auth";

// DELETE /api/history/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Only delete if the item belongs to the authenticated user
  const deleted = await db
    .delete(historyItems)
    .where(
      and(eq(historyItems.id, id), eq(historyItems.userId, session.id))
    )
    .returning({ id: historyItems.id });

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
