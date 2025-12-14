"use client";

import { usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-navbar";

const navItems = [
  {
    name: "Home",
    link: "/",
  },
];

const FloatingNavbarContent = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return <FloatingNav navItems={navItems} alwaysVisible={isHomePage} />;
};

export default FloatingNavbarContent;
