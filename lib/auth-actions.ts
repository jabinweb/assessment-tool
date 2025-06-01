"use server"

import { signIn, signOut } from "@/auth"
import { redirect } from "next/navigation"

export async function handleSignIn(provider?: string) {
  await signIn(provider, { redirectTo: "/dashboard" })
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" })
}
