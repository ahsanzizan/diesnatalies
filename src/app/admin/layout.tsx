"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [nav, setNav] = useState(false);

  if (status !== "authenticated") {
    return redirect("/auth/login");
  }

  return (
    <>
      <Navbar
        nav={nav}
        setNav={setNav}
        username={session?.user?.username || ""}
      />
      <div>
        <div className="flex overflow-hidden bg-white pt-16">
          <Sidebar nav={nav} />
          <div
            className={`bg-gray-900 opacity-50 ${
              nav ? "" : "hidden"
            } fixed inset-0 z-10`}
            id="sidebarBackdrop"
          />
          <div
            id="main-content"
            className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
          >
            <main className="h-full">
              <div className="pt-6 px-4">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
