import React, { createContext, useContext, useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { translations } from '@/lib/translations'

type Language = 'en' | 'he'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get userId from localStorage (set by Auth component)
  const [userId, setUserId] = useState<string | null>(null)
  
  useEffect(() => {
    const stored = localStorage.getItem('auth-user')
    if (stored) {
      try {
        const user = JSON.parse(stored)
        setUserId(user.id)
      } catch {}
    }
  }, [])
  
  const settings = useQuery(api.settings.getSettings, userId ? { userId } : 'skip')
  const saveSettings = useMutation(api.settings.saveSettings)
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  useEffect(() => {
    const lang = settings?.language || 'en'
    setCurrentLanguage(lang)
    // Update document direction for RTL support
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
  }, [settings])

  const setLanguage = async (lang: Language) => {
    setCurrentLanguage(lang)
    if (userId) {
      await saveSettings({ userId, language: lang })
    }
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations[currentLanguage]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value !== 'string') {
      return key // Return key if translation not found
    }
    
    // Replace parameters in the translation
    if (params && typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match
      })
    }
    
    return value || key
  }

  const dir = currentLanguage === 'he' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}