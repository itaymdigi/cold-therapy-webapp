import React from 'react'
import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>
}
