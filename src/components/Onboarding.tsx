import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Snowflake, 
  Wind, 
  Timer, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Target,
  Heart,
  Thermometer
} from '@phosphor-icons/react'
// Removed Spark dependency - using local state only
import coldTherapyLogo from '@/assets/images/cold-therapy-logo.svg'

interface OnboardingProps {
  onComplete: (preferences: UserPreferences) => void
}

interface UserPreferences {
  name: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  preferredDuration: number
  interests: ('cold-therapy' | 'breathing')[]
}

const EXPERIENCE_LEVELS = [
  {
    value: 'beginner' as const,
    titleKey: 'onboarding.experience.beginner.title',
    descKey: 'onboarding.experience.beginner.desc',
    icon: Target,
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    value: 'intermediate' as const,
    titleKey: 'onboarding.experience.intermediate.title', 
    descKey: 'onboarding.experience.intermediate.desc',
    icon: Heart,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    value: 'advanced' as const,
    titleKey: 'onboarding.experience.advanced.title',
    descKey: 'onboarding.experience.advanced.desc', 
    icon: Trophy,
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  }
]

const GOALS = [
  { key: 'stress-relief', icon: Heart },
  { key: 'focus', icon: Target },
  { key: 'recovery', icon: Thermometer },
  { key: 'energy', icon: Trophy },
  { key: 'sleep', icon: Timer },
  { key: 'mindfulness', icon: Wind }
]

const INTERESTS = [
  {
    key: 'cold-therapy' as const,
    icon: Snowflake,
    titleKey: 'onboarding.interests.coldTherapy.title',
    descKey: 'onboarding.interests.coldTherapy.desc'
  },
  {
    key: 'breathing' as const,
    icon: Wind, 
    titleKey: 'onboarding.interests.breathing.title',
    descKey: 'onboarding.interests.breathing.desc'
  }
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: '',
    experience: 'beginner',
    goals: [],
    preferredDuration: 60,
    interests: ['cold-therapy']
  })

  const steps = [
    'welcome',
    'name', 
    'experience',
    'interests',
    'goals',
    'duration',
    'complete'
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGoalToggle = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const handleInterestToggle = (interest: 'cold-therapy' | 'breathing') => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleComplete = () => {
    onComplete(preferences)
  }

  const canProceed = () => {
    switch (steps[currentStep]) {
      case 'name':
        return preferences.name.trim().length > 0
      case 'interests':
        return preferences.interests.length > 0
      case 'goals':
        return preferences.goals.length > 0
      default:
        return true
    }
  }

  const renderStep = () => {
    const step = steps[currentStep]

    switch (step) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center mb-6">
              <img 
                src={coldTherapyLogo} 
                alt="Cold Therapy by Dan Hayat" 
                className="h-20 w-auto object-contain"
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">
                {t('onboarding.welcome.title')}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('onboarding.welcome.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <Snowflake className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-800">
                  {t('onboarding.welcome.coldTherapy')}
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Wind className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-800">
                  {t('onboarding.welcome.breathing')}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {t('onboarding.welcome.description')}
            </p>
          </motion.div>
        )

      case 'name':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {t('onboarding.name.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('onboarding.name.subtitle')}
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium">
                {t('onboarding.name.label')}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t('onboarding.name.placeholder')}
                value={preferences.name}
                onChange={(e) => setPreferences(prev => ({ ...prev, name: e.target.value }))}
                className="text-center text-lg"
                autoFocus
              />
            </div>
          </motion.div>
        )

      case 'experience':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {t('onboarding.experience.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('onboarding.experience.subtitle')}
              </p>
            </div>

            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map((level) => {
                const Icon = level.icon
                const isSelected = preferences.experience === level.value
                
                return (
                  <Card 
                    key={level.value}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, experience: level.value }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${level.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {t(level.titleKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(level.descKey)}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        )

      case 'interests':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {t('onboarding.interests.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('onboarding.interests.subtitle')}
              </p>
            </div>

            <div className="space-y-3">
              {INTERESTS.map((interest) => {
                const Icon = interest.icon
                const isSelected = preferences.interests.includes(interest.key)
                
                return (
                  <Card 
                    key={interest.key}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleInterestToggle(interest.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          interest.key === 'cold-therapy' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {t(interest.titleKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(interest.descKey)}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        )

      case 'goals':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {t('onboarding.goals.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('onboarding.goals.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((goal) => {
                const Icon = goal.icon
                const isSelected = preferences.goals.includes(goal.key)
                
                return (
                  <Badge
                    key={goal.key}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer p-3 h-auto flex flex-col items-center gap-2 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleGoalToggle(goal.key)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">
                      {t(`onboarding.goals.options.${goal.key}`)}
                    </span>
                  </Badge>
                )
              })}
            </div>
          </motion.div>
        )

      case 'duration':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {t('onboarding.duration.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('onboarding.duration.subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.floor(preferences.preferredDuration / 60)}:
                  {(preferences.preferredDuration % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('onboarding.duration.minutes')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[30, 60, 90, 120, 180, 300].map((duration) => (
                  <Button
                    key={duration}
                    variant={preferences.preferredDuration === duration ? "default" : "outline"}
                    className="h-12"
                    onClick={() => setPreferences(prev => ({ ...prev, preferredDuration: duration }))}
                  >
                    {Math.floor(duration / 60)}:
                    {(duration % 60).toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-foreground">
                {t('onboarding.complete.title', { name: preferences.name })}
              </h2>
              
              <p className="text-muted-foreground">
                {t('onboarding.complete.subtitle')}
              </p>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('onboarding.complete.experience')}</span>
                  <span className="font-medium">{t(`onboarding.experience.${preferences.experience}.title`)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('onboarding.complete.interests')}</span>
                  <span className="font-medium">
                    {preferences.interests.map(i => t(`onboarding.interests.${i === 'cold-therapy' ? 'coldTherapy' : 'breathing'}.title`)).join(', ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('onboarding.complete.goals')}</span>
                  <span className="font-medium">{preferences.goals.length} {t('onboarding.complete.selected')}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('onboarding.nav.back')}
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                className="flex items-center gap-2"
              >
                {t('onboarding.nav.getStarted')}
                <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                {t('onboarding.nav.next')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}