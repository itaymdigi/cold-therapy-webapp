import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, Square, Wind, Leaf, Sun, Moon } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'

interface BreathingTechnique {
  id: string
  name: string
  description: string
  pattern: number[] // [inhale, hold, exhale, hold]
  cycles: number
  icon: React.ComponentType<any>
  color: string
  benefits: string[]
}

interface BreathingSessionProps {
  onSessionComplete: (duration: number, technique: string) => void
}

export function BreathingSession({ onSessionComplete }: BreathingSessionProps) {
  const { t } = useLanguage()
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0) // 0: inhale, 1: hold, 2: exhale, 3: hold
  const [currentCycle, setCurrentCycle] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const techniques: BreathingTechnique[] = [
    {
      id: 'box-breathing',
      name: t('breathing.techniques.boxBreathing.name'),
      description: t('breathing.techniques.boxBreathing.description'),  
      pattern: [4, 4, 4, 4],
      cycles: 10,
      icon: Square,
      color: 'text-blue-600',
      benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system']
    },
    {
      id: 'wim-hof',
      name: t('breathing.techniques.wimHof.name'),
      description: t('breathing.techniques.wimHof.description'),
      pattern: [2, 0, 1, 0], // Quick inhale, no hold, quick exhale, no hold
      cycles: 30,
      icon: Wind,
      color: 'text-cyan-600',
      benefits: ['Increases energy', 'Boosts immunity', 'Enhances cold tolerance']
    },
    {
      id: '478-breathing',
      name: t('breathing.techniques.breathing478.name'),
      description: t('breathing.techniques.breathing478.description'),
      pattern: [4, 7, 8, 0],
      cycles: 8,
      icon: Moon,
      color: 'text-indigo-600',
      benefits: ['Promotes sleep', 'Reduces anxiety', 'Calms mind']
    },
    {
      id: 'pranayama-basic',
      name: t('breathing.techniques.pranayamaBasic.name'),
      description: t('breathing.techniques.pranayamaBasic.description'),
      pattern: [4, 2, 6, 2],
      cycles: 12,
      icon: Leaf,
      color: 'text-green-600',
      benefits: ['Balances energy', 'Improves concentration', 'Purifies breath']
    },
    {
      id: 'energizing-breath',
      name: t('breathing.techniques.energizingBreath.name'),
      description: t('breathing.techniques.energizingBreath.description'),
      pattern: [3, 1, 3, 1],
      cycles: 15,
      icon: Sun,
      color: 'text-orange-600',
      benefits: ['Increases alertness', 'Boosts metabolism', 'Enhances vitality']
    }
  ]

  const phaseNames = [
    t('breathing.phases.inhale'),
    t('breathing.phases.hold'),
    t('breathing.phases.exhale'),
    t('breathing.phases.hold')
  ]

  useEffect(() => {
    if (isActive && selectedTechnique) {
      const currentPatternTime = selectedTechnique.pattern[currentPhase]
      
      if (currentPatternTime === 0) {
        // Skip phases with 0 duration
        setCurrentPhase((prev) => (prev + 1) % 4)
        return
      }

      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const nextPhase = (currentPhase + 1) % 4
            if (nextPhase === 0) {
              // Completed a full cycle
              if (currentCycle >= selectedTechnique.cycles - 1) {
                // Session complete
                const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
                handleSessionComplete(duration)
                return 0
              } else {
                setCurrentCycle(prev => prev + 1)
              }
            }
            setCurrentPhase(nextPhase)
            return selectedTechnique.pattern[nextPhase]
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, currentPhase, currentCycle, selectedTechnique])

  const handleStart = () => {
    if (!selectedTechnique) return
    
    startTimeRef.current = Date.now()
    setIsActive(true)
    setCurrentPhase(0)
    setCurrentCycle(0)
    setTimeRemaining(selectedTechnique.pattern[0])
    
    toast.success(t('breathing.notifications.sessionStarted'), {
      description: selectedTechnique.name
    })
  }

  const handlePause = () => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleStop = () => {
    setIsActive(false)
    setCurrentPhase(0)
    setCurrentCycle(0)
    setTimeRemaining(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleSessionComplete = (duration: number) => {
    setIsActive(false)
    setCurrentPhase(0)
    setCurrentCycle(0)
    setTimeRemaining(0)
    
    toast.success(t('breathing.notifications.sessionComplete'), {
      description: `${selectedTechnique?.name} - ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
    })
    
    onSessionComplete(duration, selectedTechnique?.name || 'Unknown')
  }

  const progress = selectedTechnique ? ((currentCycle + (currentPhase + 1) / 4) / selectedTechnique.cycles) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Technique Selection */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind size={24} className="text-primary" />
            {t('breathing.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedTechnique?.id || ''} 
            onValueChange={(value) => {
              const technique = techniques.find(t => t.id === value)
              setSelectedTechnique(technique || null)
              handleStop() // Reset session when changing technique
            }}
          >
            <SelectTrigger className="bg-white/80">
              <SelectValue placeholder={t('breathing.selectTechnique')} />
            </SelectTrigger>
            <SelectContent>
              {techniques.map((technique) => (
                <SelectItem key={technique.id} value={technique.id}>
                  <div className="flex items-center gap-3">
                    <technique.icon size={20} className={technique.color} />
                    <div>
                      <div className="font-medium">{technique.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {technique.cycles} {t('breathing.cycles')}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Technique Details */}
      {selectedTechnique && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <selectedTechnique.icon size={48} className={`${selectedTechnique.color} mx-auto mb-3`} />
              <h3 className="text-xl font-semibold mb-2">{selectedTechnique.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{selectedTechnique.description}</p>
              
              {/* Pattern Display */}
              <div className="flex justify-center gap-4 mb-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-blue-600">{selectedTechnique.pattern[0]}s</div>
                  <div className="text-muted-foreground">{t('breathing.phases.inhale')}</div>
                </div>
                {selectedTechnique.pattern[1] > 0 && (
                  <div className="text-center">
                    <div className="font-medium text-indigo-600">{selectedTechnique.pattern[1]}s</div>
                    <div className="text-muted-foreground">{t('breathing.phases.hold')}</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="font-medium text-green-600">{selectedTechnique.pattern[2]}s</div>
                  <div className="text-muted-foreground">{t('breathing.phases.exhale')}</div>
                </div>
                {selectedTechnique.pattern[3] > 0 && (
                  <div className="text-center">
                    <div className="font-medium text-purple-600">{selectedTechnique.pattern[3]}s</div>
                    <div className="text-muted-foreground">{t('breathing.phases.hold')}</div>
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-2">
                {selectedTechnique.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Session Controls */}
            <div className="space-y-4">
              {!isActive ? (
                <Button 
                  onClick={handleStart} 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  <Play size={20} className="mr-2" />
                  {t('breathing.startSession')}
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    onClick={handlePause} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <Pause size={20} className="mr-2" />
                    {t('breathing.pause')}
                  </Button>
                  <Button 
                    onClick={handleStop} 
                    variant="destructive" 
                    className="flex-1"
                  >
                    <Square size={20} className="mr-2" />
                    {t('breathing.stop')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Session Display */}
      <AnimatePresence>
        {isActive && selectedTechnique && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm border-primary/20 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  {/* Breathing Circle */}
                  <motion.div
                    className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center"
                    animate={{
                      scale: currentPhase === 0 ? 1.2 : currentPhase === 2 ? 0.8 : 1,
                    }}
                    transition={{
                      duration: timeRemaining,
                      ease: 'easeInOut'
                    }}
                  >
                    <selectedTechnique.icon size={48} className={selectedTechnique.color} />
                  </motion.div>

                  {/* Current Phase */}
                  <h2 className="text-3xl font-bold mb-2">
                    {phaseNames[currentPhase]}
                  </h2>
                  <div className="text-6xl font-bold text-primary mb-4">
                    {timeRemaining}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{t('breathing.cycle')} {currentCycle + 1}/{selectedTechnique.cycles}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}