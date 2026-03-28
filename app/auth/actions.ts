"use server";

import { login as loginSession, logout as logoutSession } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/users";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    await loginSession(formData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    // Redirect back to sign-in with an error query param for display
    redirect(`/auth/signin?error=${encodeURIComponent(message)}`);
  }

  const next = formData.get("next") as string;
  redirect(next || "/dashboard");
}

export async function signupAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    redirect("/auth/signup?error=All+fields+are+required");
  }

  if (password.length < 8) {
    redirect("/auth/signup?error=Password+must+be+at+least+8+characters");
  }

  // Check for existing account
  const existing = await getUserByEmail(email);
  if (existing) {
    redirect("/auth/signup?error=An+account+with+this+email+already+exists");
  }

  try {
    await createUser({ name, email, password });
  } catch {
    redirect("/auth/signup?error=Failed+to+create+account.+Please+try+again");
  }

  // Auto-login after signup
  const loginData = new FormData();
  loginData.set("email", email);
  loginData.set("password", password);
  await loginSession(loginData);

  redirect("/dashboard");
}

export async function logoutAction() {
  await logoutSession();
  redirect("/auth/signin");
}
