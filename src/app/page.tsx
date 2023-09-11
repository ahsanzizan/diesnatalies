"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Root() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status != "authenticated") {
    return redirect("/auth/login");
  } else if (user?.role == "ADMIN") {
    return redirect("/admin");
  }

  return redirect("/kasir");
}
