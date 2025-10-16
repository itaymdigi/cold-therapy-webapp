import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timer } from '@/components/Timer'
import { ThermalTimer } from '@/components/ThermalTimer'
import { ContrastTherapyTimer } from '@/components/ContrastTherapyTimer'
import { SessionTypeSelector, SessionType } from '@/components/SessionTypeSelector'
import { BreathingSession } from '@/components/BreathingSession'
import { SessionHistory } from '@/components/SessionHistory'
import { Achievements } from '@/components/Achievements'
import { UserProfile } from '@/components/UserProfile'
import { SessionCompleteDialog } from '@/components/SessionCompleteDialog'
import { EditSessionDialog } from '@/components/EditSessionDialog'
import { Navigation } from '@/components/Navigation'
import { Auth } from '@/components/Auth'
import { Onboarding } from '@/components/Onboarding'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { Thermometer, Clock, Trophy, User, Snowflake, Wind } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import coldTherapyLogo from '@/assets/images/cold-therapy-logo.svg'

interface Session {
  id: string
  duration: number
  completedAt: string
  type: 'ice-bath' | 'breathing' | 'sauna' | 'jacuzzi' | 'cold-plunge' | 'contrast-therapy'
  technique?: string // For breathing sessions
  temperature?: number // For temperature-based sessions
  mood?: string
  notes?: string
  intensity?: 'low' | 'medium' | 'high' // For tracking session intensity
}

interface AuthUser {
  id: string
  name: string
  email: string
  picture: string
  signedInAt: string
}

interface UserPreferences {
  name: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  preferredDuration: number
  interests: ('cold-therapy' | 'breathing')[]
  onboardingCompleted: boolean
}

function AppContent() {
  const { t, dir } = useLanguage()
  const [sessions, setSessions] = useKV<Session[]>('ice-bath-sessions', [])
  const [userPreferences, setUserPreferences] = useKV<UserPreferences>('user-preferences', {
    name: '',
    experience: 'beginner',
    goals: [],
    preferredDuration: 60,
    interests: ['cold-therapy'],
    onboardingCompleted: false
  })
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [completedDuration, setCompletedDuration] = useState(0)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [activeTab, setActiveTab] = useState('timer')
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null)

  const handleAuthChange = (authUser: AuthUser | null) => {
    setUser(authUser)
  }

  const handleSessionComplete = (
    duration: number, 
    type: SessionType = 'ice-bath', 
    technique?: string,
    temperature?: number,
    intensity?: 'low' | 'medium' | 'high'
  ) => {
    setCompletedDuration(duration)
    if (type === 'breathing') {
      // For breathing sessions, save immediately with technique info
      const newSession: Session = {
        id: Date.now().toString(),
        duration,
        completedAt: new Date().toISOString(),
        type: 'breathing',
        technique,
        notes: undefined,
        mood: undefined
      }

      setSessions(currentSessions => [...(currentSessions || []), newSession])
      
      toast.success(t('breathing.notifications.sessionComplete'), {
        description: `${technique || 'Unknown'} - ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
      })
    } else {
      // For thermal sessions, save immediately with session details
      const newSession: Session = {
        id: Date.now().toString(),
        duration,
        completedAt: new Date().toISOString(),
        type,
        temperature,
        intensity,
        notes: undefined,
        mood: undefined
      }

      setSessions(currentSessions => [...(currentSessions || []), newSession])
      
      const sessionName = t(`sessionTypes.${type}.name`) || type || 'Session'
      const durationStr = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
      const tempStr = temperature ? ` at ${temperature}°C` : ''
      
      toast.success(t('notifications.sessionComplete'), {
        description: `${sessionName} - ${durationStr}${tempStr}`
      })
      
      // Reset session type selection
      setSelectedSessionType(null)
    }
  }

  const handleSaveSession = (notes: string, mood: string) => {
    const newSession: Session = {
      id: Date.now().toString(),
      duration: completedDuration,
      completedAt: new Date().toISOString(),
      type: 'ice-bath',
      notes: notes || undefined,
      mood: mood || undefined
    }

    setSessions(currentSessions => [...(currentSessions || []), newSession])
    
    toast.success(t('notifications.sessionSaved'), {
      description: t('notifications.sessionSavedDesc', { 
        minutes: Math.floor(completedDuration / 60).toString(),
        seconds: (completedDuration % 60).toString()
      })
    })
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setShowEditDialog(true)
  }

  const handleUpdateSession = (updatedSession: Session) => {
    setSessions(currentSessions => 
      (currentSessions || []).map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    )
    
    toast.success(t('notifications.sessionUpdated'), {
      description: t('notifications.sessionUpdatedDesc')
    })
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(currentSessions => 
      (currentSessions || []).filter(session => session.id !== sessionId)
    )
    
    toast.success(t('notifications.sessionDeleted'), {
      description: t('notifications.sessionDeletedDesc')
    })
  }

  const handleOnboardingComplete = (preferences: Omit<UserPreferences, 'onboardingCompleted'>) => {
    setUserPreferences({ ...preferences, onboardingCompleted: true })
    toast.success(t('onboarding.complete.title', { name: preferences.name }), {
      description: t('onboarding.complete.subtitle')
    })
  }

  // Show auth screen if user is not signed in
  if (!user) {
    return <Auth onAuthChange={handleAuthChange} />
  }

  // Show onboarding if not completed
  if (!userPreferences?.onboardingCompleted) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 relative overflow-hidden" dir={dir}>
      {/* Beautiful background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl" />
      </div>
      
      {/* Navigation */}
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userPicture={user?.picture}
        userName={user?.name}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-4 pt-6 pb-24"> {/* Added bottom padding for nav */}
        {/* Elegant header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Logo with enhanced styling */}
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl rounded-full" />
              <img 
                src={coldTherapyLogo} 
                alt="Cold Therapy" 
                className="relative h-20 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>
          
          {/* App title with breathing animation */}
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 bg-clip-text text-transparent mb-2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Wellness Therapy
          </motion.h1>
          
          {/* Subtle subtitle with language switcher */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <p className="text-sm text-muted-foreground/80 font-medium">
              {t('app.subtitle')}
            </p>
            <LanguageSwitcher />
          </div>
          
          {/* Beautiful user profile card */}
          {user && userPreferences && (
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg shadow-blue-500/10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm leading-tight">
                  {userPreferences.name || user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {t(`onboarding.experience.${userPreferences.experience}.title`)}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Area with enhanced mobile design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="space-y-6"
        >
          {/* Content wrapper with beautiful glassmorphic background */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl shadow-blue-500/5 overflow-hidden">
            {activeTab === 'timer' && (
              <div className="p-6">
                {!selectedSessionType ? (
                  <SessionTypeSelector 
                    onSelect={setSelectedSessionType}
                    selectedType={selectedSessionType}
                  />
                ) : selectedSessionType === 'breathing' ? (
                  <BreathingSession 
                    onSessionComplete={(duration, technique) => 
                      handleSessionComplete(duration, 'breathing', technique)
                    } 
                  />
                ) : selectedSessionType === 'ice-bath' ? (
                  <Timer onSessionComplete={(duration) => handleSessionComplete(duration, 'ice-bath')} />
                ) : selectedSessionType === 'contrast-therapy' ? (
                  <ContrastTherapyTimer 
                    onSessionComplete={handleSessionComplete}
                    onBack={() => setSelectedSessionType(null)}
                  />
                ) : (
                  <ThermalTimer 
                    sessionType={selectedSessionType}
                    onSessionComplete={handleSessionComplete}
                    onBack={() => setSelectedSessionType(null)}
                  />
                )}
              </div>
            )}

            {activeTab === 'breathing' && (
              <div className="p-6">
                <BreathingSession onSessionComplete={(duration, technique) => 
                  handleSessionComplete(duration, 'breathing', technique)} />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6">
                <SessionHistory 
                  sessions={sessions || []} 
                  onEditSession={handleEditSession}
                  onDeleteSession={handleDeleteSession}
                />
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="p-6">
                <Achievements sessions={sessions || []} />
              </div>
            )}

            {activeTab === 'profile' && userPreferences && (
              <div className="p-6">
                <UserProfile 
                  sessions={sessions || []} 
                  preferences={userPreferences}
                  onUpdatePreferences={setUserPreferences}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Session Complete Dialog */}
        <SessionCompleteDialog
          isOpen={showCompleteDialog}
          onClose={() => setShowCompleteDialog(false)}
          duration={completedDuration}
          onSave={handleSaveSession}
        />

        {/* Edit Session Dialog */}
        <EditSessionDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          session={editingSession}
          onSave={handleUpdateSession}
          onDelete={handleDeleteSession}
        />

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App