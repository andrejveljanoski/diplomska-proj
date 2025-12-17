"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FloatingNavbar from "../components/FloatingNavbar";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <FloatingNavbar />
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-32">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0].toUpperCase() ||
    "U";

  return (
    <>
      <FloatingNavbar />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-32">
        {/* Profile Header */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">
                  {user.name || "User"}
                </CardTitle>
                <CardDescription className="text-base">
                  {user.email}
                </CardDescription>
                <div className="mt-3">
                  <Badge variant="secondary">Active User</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base">{user.name || "Not provided"}</p>
              </div>

              <Separator />

              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{user.email}</p>
              </div>

              <Separator />

              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="font-mono text-sm">{user.id || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Track your progress exploring Macedonia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Welcome to your profile! Here you can view your account
              information and track your journey exploring the regions of
              Macedonia. Visit the home page to mark regions you&apos;ve visited
              and save your progress.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
