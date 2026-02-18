"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    async function syncUser() {
      if (isLoaded && isSignedIn && user) {
        try {
          // Call the Next.js API route we just created
          await fetch("/api/user", {
            method: "POST",
          });
        } catch (error) {
          console.error("User sync failed:", error);
        }
      }
    }

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return null; // This component doesn't render anything
}
