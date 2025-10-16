import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SignIn, SignOut, User, Crown, Globe } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface UserInfo {
  avatarUrl: string
  email: string
  id: number | string
  isOwner: boolean
  login: string
}

interface UserPreferences {
  name: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  preferredDuration: number
  interests: ('cold-therapy' | 'breathing')[]
  onboardingCompleted: boolean
}

interface UserProfileProps {
  sessions: Array<{ duration: number; completedAt: string }>
  preferences?: UserPreferences
  onUpdatePreferences?: (preferences: UserPreferences) => void
}

export function UserProfile({ sessions, preferences, onUpdatePreferences }: UserProfileProps) {
  const { t } = useLanguage()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [authUser, setAuthUser] = useKV<any>('auth-user', null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await window.spark.user()
        setUser(userInfo)
      } catch (error) {
        console.log('Not signed in')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSignOut = () => {
    setAuthUser(null)
    setUser(null)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <User size={48} className="text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Sign in to track your progress</h3>
            <p className="text-muted-foreground mb-4">
              Connect with GitHub to save your sessions and unlock achievements
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <SignIn />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalSessions = sessions.length
  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalHours = Math.floor(totalTime / 3600)
  const totalMinutes = Math.floor((totalTime % 3600) / 60)

  const getLevel = (sessionCount: number) => {
    if (sessionCount >= 100) return { level: 10, title: 'Ice Master', next: null }
    if (sessionCount >= 75) return { level: 9, title: 'Polar Expert', next: 100 }
    if (sessionCount >= 50) return { level: 8, title: 'Cold Warrior', next: 75 }
    if (sessionCount >= 35) return { level: 7, title: 'Ice Veteran', next: 50 }
    if (sessionCount >= 25) return { level: 6, title: 'Frost Fighter', next: 35 }
    if (sessionCount >= 15) return { level: 5, title: 'Chill Champion', next: 25 }
    if (sessionCount >= 10) return { level: 4, title: 'Cool Crusader', next: 15 }
    if (sessionCount >= 5) return { level: 3, title: 'Ice Apprentice', next: 10 }
    if (sessionCount >= 2) return { level: 2, title: 'Cold Rookie', next: 5 }
    if (sessionCount >= 1) return { level: 1, title: 'Ice Novice', next: 2 }
    return { level: 0, title: 'Newcomer', next: 1 }
  }

  const userLevel = getLevel(totalSessions)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatarUrl} alt={user.login} />
              <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {preferences?.name || user.login}
                </h3>
                {user.isOwner && (
                  <Crown size={16} className="text-accent" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Level {userLevel.level}</Badge>
                <span className="text-sm text-muted-foreground">{userLevel.title}</span>
              </div>
              {preferences && (
                <div className="text-xs text-muted-foreground mt-1">
                  {t(`onboarding.experience.${preferences.experience}.title`)} • 
                  {preferences.interests.length} {t('onboarding.complete.interests').toLowerCase()}
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground"
          >
            <SignOut />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Progress */}
        {userLevel.next && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel.level + 1}</span>
              <span>{totalSessions}/{userLevel.next}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${(totalSessions / userLevel.next) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{totalSessions}</div>
            <div className="text-xs text-muted-foreground">{t('achievements.totalSessions')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-primary">
              {totalHours > 0 ? `${totalHours}h` : `${totalMinutes}m`}
            </div>
            <div className="text-xs text-muted-foreground">{t('achievements.totalTime')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{userLevel.level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
        </div>

        {/* User Preferences */}
        {preferences && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">{t('profile.preferences.title')}</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground">{t('onboarding.complete.experience')}</div>
                <div className="font-medium text-sm">
                  {t(`onboarding.experience.${preferences.experience}.title`)}
                </div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground">{t('onboarding.complete.goals')}</div>
                <div className="font-medium text-sm">
                  {preferences.goals.length} {t('onboarding.complete.selected')}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {preferences.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {t(`onboarding.interests.${interest === 'cold-therapy' ? 'coldTherapy' : 'breathing'}.title`)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Language Preferences */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">{t('profile.preferences.language')}</h4>
              <p className="text-xs text-muted-foreground">Choose your preferred language</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}