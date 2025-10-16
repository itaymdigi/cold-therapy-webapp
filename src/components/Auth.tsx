import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Thermometer, Snowflake } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface User {
  id: string
  name: string
  email: string
  picture: string
  signedInAt: string
}

interface AuthProps {
  onAuthChange: (user: User | null) => void
}

export function Auth({ onAuthChange }: AuthProps) {
  const { t, dir } = useLanguage()
  const [user, setUser] = useKV<User | null>('auth-user', null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    onAuthChange(user || null)
  }, [user, onAuthChange])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Google OAuth flow with current GitHub user
      const currentUser = await window.spark.user()
      
      if (!currentUser) {
        throw new Error('No user found')
      }
      
      const mockGoogleUser: User = {
        id: currentUser.id.toString(),
        name: currentUser.login,
        email: currentUser.email || `${currentUser.login}@github.com`,
        picture: currentUser.avatarUrl,
        signedInAt: new Date().toISOString()
      }
      
      setUser(mockGoogleUser)
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    setUser(null)
  }

  if (user) {
    return (
      <div className="flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={user.picture}
            alt={user.name}
            className="w-10 h-10 rounded-full ring-2 ring-primary/20"
          />
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4" dir={dir}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
      
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Thermometer size={40} className="text-blue-600" />
              <Snowflake 
                size={20} 
                className="absolute -top-1 -right-1 text-indigo-400 animate-pulse" 
              />
            </div>
            <LanguageSwitcher />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('app.title')}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {t('app.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">⏱️</div>
                <div className="text-xs text-blue-600/80 mt-1">{t('auth.features.timer')}</div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">🏆</div>
                <div className="text-xs text-indigo-600/80 mt-1">{t('auth.features.achievements')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">📊</div>
                <div className="text-xs text-purple-600/80 mt-1">{t('auth.features.tracking')}</div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm font-medium relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-center gap-3 relative z-10">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? 'Signing in...' : t('auth.signIn')}
            </div>
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}