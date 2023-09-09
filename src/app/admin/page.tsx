"use client";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session, status } = useSession();

  return <>{session?.user?.name}</>;
}
