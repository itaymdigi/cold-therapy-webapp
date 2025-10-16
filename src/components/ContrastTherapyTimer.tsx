import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Pause, Square, ArrowLeft, Fire, Snowflake, ArrowsClockwise, Clock, Thermometer } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'

interface ContrastProtocol {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cycles: {
    type: 'hot' | 'cold'
    duration: number // in seconds
    temperature?: number
    description: string
  }[]
  totalDuration: number
  benefits: string[]
}

interface ContrastTherapyTimerProps {
  onSessionComplete: (duration: number, type: 'contrast-therapy', technique?: string, temperature?: number, intensity?: 'low' | 'medium' | 'high') => void
  onBack: () => void
}

export function ContrastTherapyTimer({ onSessionComplete, onBack }: ContrastTherapyTimerProps) {
  const { t } = useLanguage()
  
  // Contrast therapy protocols
  const protocols: ContrastProtocol[] = [
    {
      id: 'basic-3-1',
      name: t('contrastTherapy.protocols.basic31.name'),
      description: t('contrastTherapy.protocols.basic31.description'),
      difficulty: 'beginner',
      totalDuration: 480, // 8 minutes
      cycles: [
        { type: 'hot', duration: 180, temperature: 40, description: t('contrastTherapy.phases.warmStart') },
        { type: 'cold', duration: 60, temperature: 15, description: t('contrastTherapy.phases.coldShock') },
        { type: 'hot', duration: 180, temperature: 40, description: t('contrastTherapy.phases.warmRecovery') },
        { type: 'cold', duration: 60, temperature: 15, description: t('contrastTherapy.phases.coldFinish') }
      ],
      benefits: [t('contrastTherapy.benefits.circulation'), t('contrastTherapy.benefits.recovery')]
    },
    {
      id: 'finnish-method',
      name: t('contrastTherapy.protocols.finnish.name'),
      description: t('contrastTherapy.protocols.finnish.description'),
      difficulty: 'intermediate',
      totalDuration: 900, // 15 minutes
      cycles: [
        { type: 'hot', duration: 300, temperature: 85, description: t('contrastTherapy.phases.saunaWarmup') },
        { type: 'cold', duration: 60, temperature: 8, description: t('contrastTherapy.phases.icePlunge') },
        { type: 'hot', duration: 300, temperature: 85, description: t('contrastTherapy.phases.saunaMain') },
        { type: 'cold', duration: 90, temperature: 8, description: t('contrastTherapy.phases.coldExtended') },
        { type: 'hot', duration: 240, temperature: 85, description: t('contrastTherapy.phases.saunaFinish') },
        { type: 'cold', duration: 30, temperature: 8, description: t('contrastTherapy.phases.finalChill') }
      ],
      benefits: [t('contrastTherapy.benefits.detox'), t('contrastTherapy.benefits.endurance'), t('contrastTherapy.benefits.mental')]
    },
    {
      id: 'performance',
      name: t('contrastTherapy.protocols.performance.name'),
      description: t('contrastTherapy.protocols.performance.description'),
      difficulty: 'advanced',
      totalDuration: 720, // 12 minutes
      cycles: [
        { type: 'hot', duration: 120, temperature: 42, description: t('contrastTherapy.phases.hotPre') },
        { type: 'cold', duration: 90, temperature: 12, description: t('contrastTherapy.phases.coldIntense') },
        { type: 'hot', duration: 120, temperature: 42, description: t('contrastTherapy.phases.hotMid') },
        { type: 'cold', duration: 90, temperature: 10, description: t('contrastTherapy.phases.coldDeep') },
        { type: 'hot', duration: 120, temperature: 42, description: t('contrastTherapy.phases.hotFinal') },
        { type: 'cold', duration: 120, temperature: 8, description: t('contrastTherapy.phases.coldMax') },
        { type: 'hot', duration: 60, temperature: 38, description: t('contrastTherapy.phases.warmDown') }
      ],
      benefits: [t('contrastTherapy.benefits.performance'), t('contrastTherapy.benefits.adaptation'), t('contrastTherapy.benefits.resilience')]
    }
  ]

  const [selectedProtocol, setSelectedProtocol] = useState<ContrastProtocol | null>(null)
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    if (selectedProtocol && !sessionStarted) {
      setTimeRemaining(selectedProtocol.cycles[0]?.duration || 0)
    }
  }, [selectedProtocol, sessionStarted])

  useEffect(() => {
    let interval: number | null = null

    if (isRunning && timeRemaining > 0 && selectedProtocol) {
      interval = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Current cycle completed
            const nextCycleIndex = currentCycleIndex + 1
            
            if (nextCycleIndex < selectedProtocol.cycles.length) {
              // Move to next cycle
              setCurrentCycleIndex(nextCycleIndex)
              const nextCycle = selectedProtocol.cycles[nextCycleIndex]
              
              // Notify phase change
              const currentCycle = selectedProtocol.cycles[currentCycleIndex]
              const nextCycleType = nextCycle.type === 'hot' ? '🔥' : '🧊'
              toast.success(`${nextCycleType} ${t('contrastTherapy.phaseChange')}`, {
                description: nextCycle.description
              })
              
              return nextCycle.duration
            } else {
              // Session complete
              setIsRunning(false)
              const technique = selectedProtocol.name
              const avgTemp = selectedProtocol.cycles.reduce((acc, cycle) => 
                acc + (cycle.temperature || 0), 0) / selectedProtocol.cycles.length
              
              onSessionComplete(totalElapsed + 1, 'contrast-therapy', technique, avgTemp, 'high')
              return 0
            }
          }
          return prev - 1
        })
        
        setTotalElapsed(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, currentCycleIndex, selectedProtocol, totalElapsed, onSessionComplete, t])

  const handleStart = () => {
    if (!selectedProtocol) return
    
    setIsRunning(true)
    setIsPaused(false)
    setSessionStarted(true)
    setShowInstructions(false)
    
    const currentCycle = selectedProtocol.cycles[currentCycleIndex]
    const phaseIcon = currentCycle.type === 'hot' ? '🔥' : '🧊'
    toast.success(`${phaseIcon} ${t('contrastTherapy.sessionStarted')}`, {
      description: currentCycle.description
    })
  }

  const handlePause = () => {
    setIsRunning(false)
    setIsPaused(true)
    toast.info(t('timer.pause'))
  }

  const handleResume = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handleStop = () => {
    if (totalElapsed > 30) { // Only save if session was longer than 30 seconds
      const technique = selectedProtocol?.name || 'Custom'
      const avgTemp = selectedProtocol 
        ? selectedProtocol.cycles.reduce((acc, cycle) => 
            acc + (cycle.temperature || 0), 0) / selectedProtocol.cycles.length
        : 0
      
      onSessionComplete(totalElapsed, 'contrast-therapy', technique, avgTemp, 'medium')
    } else {
      toast.info(t('contrastTherapy.sessionTooShort'))
      onBack()
    }
  }

  const handleSelectProtocol = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId)
    if (protocol) {
      setSelectedProtocol(protocol)
      setCurrentCycleIndex(0)
      setTimeRemaining(protocol.cycles[0]?.duration || 0)
      setTotalElapsed(0)
      setIsRunning(false)
      setIsPaused(false)
      setSessionStarted(false)
      setShowInstructions(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentCycle = () => {
    return selectedProtocol?.cycles[currentCycleIndex]
  }

  const getProgressPercentage = () => {
    if (!selectedProtocol) return 0
    const totalSessionTime = selectedProtocol.totalDuration
    const elapsedTime = totalElapsed
    return Math.min((elapsedTime / totalSessionTime) * 100, 100)
  }

  const getCycleProgressPercentage = () => {
    const currentCycle = getCurrentCycle()
    if (!currentCycle) return 0
    const elapsed = currentCycle.duration - timeRemaining
    return (elapsed / currentCycle.duration) * 100
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Protocol selection view
  if (!selectedProtocol || showInstructions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('contrastTherapy.title')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('contrastTherapy.subtitle')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {protocols.map((protocol, index) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-4 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  selectedProtocol?.id === protocol.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-card/80'
                }`}
                onClick={() => handleSelectProtocol(protocol.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <ArrowsClockwise size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{protocol.name}</h3>
                        <p className="text-xs text-muted-foreground">{protocol.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getDifficultyColor(protocol.difficulty)}>
                        {t(`difficulty.${protocol.difficulty}`)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {Math.floor(protocol.totalDuration / 60)}m
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium text-foreground mb-1">{t('contrastTherapy.cycles')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {protocol.cycles.map((cycle, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={cycle.type === 'hot' ? 'border-red-200 text-red-700' : 'border-blue-200 text-blue-700'}
                          >
                            {cycle.type === 'hot' ? '🔥' : '🧊'} {Math.floor(cycle.duration / 60)}m
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">{t('sessionTypes.benefits')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {protocol.benefits.slice(0, 2).map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedProtocol?.id === protocol.id && (
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {t('sessionTypes.startSession')}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedProtocol && (
          <div className="mt-6">
            <Button 
              onClick={() => setShowInstructions(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              {t('contrastTherapy.beginProtocol')}
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Timer view
  const currentCycle = getCurrentCycle()
  if (!currentCycle) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowInstructions(true)}
          disabled={isRunning}
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="text-center flex-1">
          <h2 className="text-lg font-bold text-foreground">
            {selectedProtocol.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t('contrastTherapy.cycle')} {currentCycleIndex + 1} {t('contrastTherapy.of')} {selectedProtocol.cycles.length}
          </p>
        </div>
      </div>

      {/* Current Phase Card */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          {/* Phase Icon and Type */}
          <motion.div
            key={currentCycleIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl
              ${currentCycle.type === 'hot' 
                ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}
          >
            {currentCycle.type === 'hot' ? <Fire size={32} /> : <Snowflake size={32} />}
          </motion.div>

          {/* Phase Description */}
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {currentCycle.type === 'hot' ? t('contrastTherapy.hot') : t('contrastTherapy.cold')}
            </h3>
            <p className="text-muted-foreground text-sm">
              {currentCycle.description}
            </p>
            {currentCycle.temperature && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <Thermometer size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">
                  {currentCycle.temperature}°C
                </span>
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="space-y-3">
            <div className="text-4xl font-mono font-bold text-foreground">
              {formatTime(timeRemaining)}
            </div>
            
            {/* Cycle Progress */}
            <Progress 
              value={getCycleProgressPercentage()} 
              className="h-2"
            />
            
            {/* Total Session Progress */}
            <div className="text-xs text-muted-foreground">
              {t('contrastTherapy.totalProgress')}: {formatTime(totalElapsed)} / {formatTime(selectedProtocol.totalDuration)}
            </div>
            <Progress 
              value={getProgressPercentage()} 
              className="h-1"
            />
          </div>
        </div>
      </Card>

      {/* Upcoming Cycles Preview */}
      {currentCycleIndex < selectedProtocol.cycles.length - 1 && (
        <Card className="p-4">
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t('contrastTherapy.nextPhases')}:
            </p>
            <div className="flex justify-center gap-2">
              {selectedProtocol.cycles.slice(currentCycleIndex + 1, currentCycleIndex + 4).map((cycle, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className={`text-xs ${cycle.type === 'hot' 
                    ? 'border-red-200 text-red-700' 
                    : 'border-blue-200 text-blue-700'
                  }`}
                >
                  {cycle.type === 'hot' ? '🔥' : '🧊'} {Math.floor(cycle.duration / 60)}m
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {!sessionStarted ? (
          <Button 
            onClick={handleStart}
            className="col-span-2 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <Play size={20} className="mr-2" />
            {t('timer.startSession')}
          </Button>
        ) : (
          <>
            <Button
              onClick={isPaused ? handleResume : handlePause}
              variant="outline"
              className="h-14"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
              <span className="ml-2">
                {isPaused ? t('timer.resume') : t('timer.pause')}
              </span>
            </Button>
            <Button
              onClick={handleStop}
              variant="destructive"
              className="h-14"
            >
              <Square size={20} className="mr-2" />
              {t('timer.stop')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}