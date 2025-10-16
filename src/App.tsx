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
import { useMutation, useQuery } from 'convex/react'
import { Authenticated, Unauthenticated } from "convex/react"
import { api } from '../convex/_generated/api'
import { Id } from '../convex/_generated/dataModel'
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
  
  // Get current authenticated user ID from Convex Auth
  const userId = useQuery(api.helpers.getUserId)
  const sessionsData = useQuery(api.sessions.getUserSessions, userId ? { userId } : 'skip')
  const preferencesData = useQuery(api.preferences.getPreferences, userId ? { userId } : 'skip')
  const createSessionMutation = useMutation(api.sessions.createSession)
  const updateSessionMutation = useMutation(api.sessions.updateSession)
  const deleteSessionMutation = useMutation(api.sessions.deleteSession)
  const savePreferencesMutation = useMutation(api.preferences.savePreferences)
  
  // Convert Convex data to local format
  const sessions = sessionsData?.map(s => ({
    id: s._id,
    duration: s.duration,
    completedAt: s.completedAt,
    type: s.type,
    technique: s.technique,
    temperature: s.temperature,
    mood: s.mood,
    notes: s.notes,
    intensity: s.intensity
  })) || []
  
  const userPreferences = preferencesData || {
    name: '',
    experience: 'beginner' as const,
    goals: [],
    preferredDuration: 60,
    interests: ['cold-therapy' as const],
    onboardingCompleted: false
  }
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [completedDuration, setCompletedDuration] = useState(0)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [activeTab, setActiveTab] = useState('timer')
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null)

  const handleSessionComplete = async (
    duration: number, 
    type: SessionType = 'ice-bath', 
    technique?: string,
    temperature?: number,
    intensity?: 'low' | 'medium' | 'high'
  ) => {
    if (!userId) return
    
    setCompletedDuration(duration)
    
    try {
      await createSessionMutation({
        userId,
        duration,
        completedAt: new Date().toISOString(),
        type,
        technique,
        temperature,
        intensity,
      })
      
      if (type === 'breathing') {
        toast.success(t('breathing.notifications.sessionComplete'), {
          description: `${technique || 'Unknown'} - ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
        })
      } else {
        const sessionName = t(`sessionTypes.${type}.name`) || type || 'Session'
        const durationStr = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
        const tempStr = temperature ? ` at ${temperature}°C` : ''
        
        toast.success(t('notifications.sessionComplete'), {
          description: `${sessionName} - ${durationStr}${tempStr}`
        })
        
        setSelectedSessionType(null)
      }
    } catch (error) {
      console.error('Failed to save session:', error)
      toast.error('Failed to save session')
    }
  }

  const handleSaveSession = async (notes: string, mood: string) => {
    if (!userId) return
    
    try {
      await createSessionMutation({
        userId,
        duration: completedDuration,
        completedAt: new Date().toISOString(),
        type: 'ice-bath',
        notes: notes || undefined,
        mood: mood || undefined
      })
      
      toast.success(t('notifications.sessionSaved'), {
        description: t('notifications.sessionSavedDesc', { 
          minutes: Math.floor(completedDuration / 60).toString(),
          seconds: (completedDuration % 60).toString()
        })
      })
    } catch (error) {
      console.error('Failed to save session:', error)
      toast.error('Failed to save session')
    }
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setShowEditDialog(true)
  }

  const handleUpdateSession = async (updatedSession: Session) => {
    try {
      await updateSessionMutation({
        id: updatedSession.id as Id<'sessions'>,
        duration: updatedSession.duration,
        mood: updatedSession.mood,
        notes: updatedSession.notes,
        temperature: updatedSession.temperature,
        intensity: updatedSession.intensity
      })
      
      toast.success(t('notifications.sessionUpdated'), {
        description: t('notifications.sessionUpdatedDesc')
      })
    } catch (error) {
      console.error('Failed to update session:', error)
      toast.error('Failed to update session')
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSessionMutation({ id: sessionId as Id<'sessions'> })
      
      toast.success(t('notifications.sessionDeleted'), {
        description: t('notifications.sessionDeletedDesc')
      })
    } catch (error) {
      console.error('Failed to delete session:', error)
      toast.error('Failed to delete session')
    }
  }

  const handleOnboardingComplete = async (preferences: Omit<UserPreferences, 'onboardingCompleted'>) => {
    if (!userId) return
    
    try {
      await savePreferencesMutation({
        userId,
        ...preferences,
        onboardingCompleted: true
      })
      
      toast.success(t('onboarding.complete.title', { name: preferences.name }), {
        description: t('onboarding.complete.subtitle')
      })
    } catch (error) {
      console.error('Failed to save preferences:', error)
      toast.error('Failed to save preferences')
    }
  }

  // Show onboarding if not completed
  if (userId && !userPreferences?.onboardingCompleted) {
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
        userPicture={undefined}
        userName={userPreferences?.name}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-4 sm:px-6 pt-6 pb-24 sm:pb-28"> {/* Responsive padding */}
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
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 bg-clip-text text-transparent mb-2"
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
          {userPreferences && (
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg shadow-blue-500/10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white shadow-md">
                  {userPreferences.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm leading-tight">
                  {userPreferences.name}
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
                  onUpdatePreferences={async (prefs) => {
                    if (!userId) return
                    await savePreferencesMutation({ userId, ...prefs })
                  }}
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
      <Unauthenticated>
        <Auth onAuthChange={() => {}} />
      </Unauthenticated>
      <Authenticated>
        <AppContent />
      </Authenticated>
    </LanguageProvider>
  )
}

export default App