import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, type NewUser, type User } from "./schema";

/**
 * Fetch a user by email. Returns null if not found.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Create a new user with a bcrypt-hashed password.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const passwordHash = await bcrypt.hash(data.password, 12);

  const newUser: NewUser = {
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
  };

  const result = await db.insert(users).values(newUser).returning();
  return result[0];
}

/**
 * Validate a plaintext password against a stored bcrypt hash.
 */
export async function validatePassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
