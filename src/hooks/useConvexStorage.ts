import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

/**
 * Hook to replace useKV with Convex database storage
 * Provides the same API but uses Convex for cloud sync
 */
export function useConvexUser() {
  const [userId, setUserId] = useState<string | null>(() => {
    // Get userId from localStorage for now
    const stored = localStorage.getItem('auth-user')
    if (stored) {
      try {
        const user = JSON.parse(stored)
        return user.id
      } catch {
        return null
      }
    }
    return null
  })

  return userId
}

// Hook for sessions
export function useConvexSessions() {
  const userId = useConvexUser()
  const sessions = useQuery(api.sessions.getUserSessions, 
    userId ? { userId } : 'skip'
  )
  const createSession = useMutation(api.sessions.createSession)
  const updateSession = useMutation(api.sessions.updateSession)
  const deleteSession = useMutation(api.sessions.deleteSession)

  return {
    sessions: sessions || [],
    createSession: async (session: any) => {
      if (!userId) return
      await createSession({ ...session, userId })
    },
    updateSession,
    deleteSession,
  }
}

// Hook for user preferences
export function useConvexPreferences() {
  const userId = useConvexUser()
  const preferences = useQuery(api.preferences.getPreferences,
    userId ? { userId } : 'skip'
  )
  const savePreferences = useMutation(api.preferences.savePreferences)

  return {
    preferences,
    savePreferences: async (prefs: any) => {
      if (!userId) return
      await savePreferences({ ...prefs, userId })
    },
  }
}

// Hook for app settings (language)
export function useConvexSettings() {
  const userId = useConvexUser()
  const settings = useQuery(api.settings.getSettings,
    userId ? { userId } : 'skip'
  )
  const saveSettings = useMutation(api.settings.saveSettings)

  return {
    settings,
    saveSettings: async (newSettings: any) => {
      if (!userId) return
      await saveSettings({ ...newSettings, userId })
    },
  }
}
