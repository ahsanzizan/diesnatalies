"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  if (!session?.user) {
    return redirect("/auth/login");
  }

  return (
    <>
      <div className="h-screen">
        <h1>Ini dashboard</h1>
      </div>
    </>
  );
}
