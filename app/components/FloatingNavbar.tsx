"use client";

import { useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { FloatingNav } from "@/components/ui/floating-navbar";

export default function FloatingNavbar() {
  const { data: session } = useSession();

  const navItems = useMemo(
    () => [
      {
        name: "Home",
        link: "/",
        icon: <span className="text-sm">🏠</span>,
      },
    ],
    []
  );

  return (
    <FloatingNav
      navItems={navItems}
      session={session}
      onSignOut={() => signOut({ callbackUrl: "/" })}
    />
  );
}
