"use client";

import { useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-navbar";

export default function FloatingNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = useMemo(() => {
    const items = [
      {
        name: "Home",
        link: "/",
        icon: <span className="text-sm">🏠</span>,
      },
      {
        name: "Regions",
        link: "/regions",
        icon: <span className="text-sm">🗺️</span>,
      },
    ];

    if (session?.user) {
      items.push({
        name: "Profile",
        link: "/profile",
        icon: <span className="text-sm">👤</span>,
      });
    }

    return items;
  }, [session]);

  return (
    <FloatingNav
      navItems={navItems}
      session={session}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      currentPath={pathname}
    />
  );
}
