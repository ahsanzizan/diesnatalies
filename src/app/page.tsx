"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: session, status } = useSession();
  const user = session?.user;
  if (status !== "authenticated") {
    return redirect("/auth");
  } else if (status == "authenticated" && user?.role == "ADMIN") {
    return redirect("/admin");
  }

  return redirect("/kasir");
}
