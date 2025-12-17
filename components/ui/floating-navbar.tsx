"use client";
import { useState, ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

interface NavItem {
  name: string;
  link: string;
  icon?: ReactNode;
}

export const FloatingNav = ({
  navItems,
  className,
  alwaysVisible = false,
  session,
  onSignOut,
  currentPath = "/",
}: {
  navItems: NavItem[];
  className?: string;
  alwaysVisible?: boolean;
  session?: Session | null;
  onSignOut?: () => void;
  currentPath?: string;
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (alwaysVisible) {
      setVisible(true);
      return;
    }
    if (current < 100) {
      setVisible(true);
    } else {
      setVisible(current < lastScrollY);
    }
    setLastScrollY(current);
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/20 rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-9999 pr-6 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx) => {
          const isActive = currentPath === navItem.link;
          return (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors",
                isActive &&
                  "font-bold underline decoration-2 underline-offset-4 text-neutral-900 dark:text-neutral-50"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Link>
          );
        })}
        {session?.user ? (
          <button
            onClick={onSignOut}
            className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors cursor-pointer text-sm"
          >
            <span>Logout</span>
          </button>
        ) : (
          <Link
            href="/login"
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors text-sm",
              currentPath === "/login" &&
                "font-bold underline decoration-2 underline-offset-4 text-neutral-900 dark:text-neutral-50"
            )}
          >
            <span>Login</span>
          </Link>
        )}
      </motion.nav>
    </AnimatePresence>
  );
};
