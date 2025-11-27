"use client";

import { useMemo } from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";

const FloatingNavbar = () => {
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

  return <FloatingNav navItems={navItems} />;
};

export default FloatingNavbar;
