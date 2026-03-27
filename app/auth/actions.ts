"use server";

import { login as loginSession, logout as logoutSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  // In a real app, you would validate the user here
  await loginSession(formData);
  
  const next = formData.get("next") as string;
  redirect(next || "/dashboard");
}

export async function logoutAction() {
  await logoutSession();
  redirect("/auth/signin");
}
