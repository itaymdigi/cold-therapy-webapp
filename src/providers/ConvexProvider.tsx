import React from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from "@convex-dev/auth/react"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
  verbose: true, // Enable verbose logging to debug auth issues
})

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  console.log("ConvexProvider - Convex URL:", import.meta.env.VITE_CONVEX_URL);
  
  // Debug: Check localStorage for auth tokens
  React.useEffect(() => {
    const keys = Object.keys(localStorage);
    console.log("LocalStorage keys:", keys);
    const authKeys = keys.filter(k => k.includes('convex') || k.includes('auth'));
    console.log("Auth-related keys:", authKeys);
    authKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value ? `${value.substring(0, 50)}...` : 'null');
    });
  }, []);
  
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
}
