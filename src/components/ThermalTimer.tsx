import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Pause, Square, Snowflake, Fire, Sun, Waves, ArrowsClockwise, Thermometer } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'
import { SessionType } from './SessionTypeSelector'

interface ThermalTimerProps {
  sessionType: SessionType
  onSessionComplete: (duration: number, type: SessionType, technique?: string, temperature?: number, intensity?: 'low' | 'medium' | 'high') => void
  onBack: () => void
}

export function ThermalTimer({ sessionType, onSessionComplete, onBack }: ThermalTimerProps) {
  const { t } = useLanguage()
  const [duration, setDuration] = useState(getDefaultDuration(sessionType))
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [temperature, setTemperature] = useState<number | undefined>(getDefaultTemperature(sessionType))
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium')

  function getDefaultDuration(type: SessionType): number {
    switch (type) {
      case 'ice-bath': return 120
      case 'cold-plunge': return 90
      case 'sauna': return 900
      case 'jacuzzi': return 1200
      case 'contrast-therapy': return 600
      default: return 300
    }
  }

  function getDefaultTemperature(type: SessionType): number | undefined {
    switch (type) {
      case 'ice-bath': return 12
      case 'cold-plunge': return 8
      case 'sauna': return 85
      case 'jacuzzi': return 38
      case 'contrast-therapy': return undefined // Varies
      default: return undefined
    }
  }

  function getSessionIcon(type: SessionType) {
    switch (type) {
      case 'ice-bath': return <Snowflake size={32} />
      case 'cold-plunge': return <Waves size={32} />
      case 'sauna': return <Fire size={32} />
      case 'jacuzzi': return <Sun size={32} />
      case 'contrast-therapy': return <ArrowsClockwise size={32} />
      default: return <Thermometer size={32} />
    }
  }

  function getSessionColor(type: SessionType) {
    switch (type) {
      case 'ice-bath': return 'from-blue-500 to-cyan-500'
      case 'cold-plunge': return 'from-cyan-500 to-blue-600'
      case 'sauna': return 'from-red-500 to-orange-500'
      case 'jacuzzi': return 'from-amber-500 to-yellow-500'
      case 'contrast-therapy': return 'from-purple-500 to-pink-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  function getTemperatureRange(type: SessionType) {
    switch (type) {
      case 'ice-bath': return { min: 8, max: 15, unit: '°C' }
      case 'cold-plunge': return { min: 2, max: 10, unit: '°C' }
      case 'sauna': return { min: 70, max: 110, unit: '°C' }
      case 'jacuzzi': return { min: 35, max: 42, unit: '°C' }
      default: return undefined
    }
  }

  function getPresetTimes(type: SessionType): number[] {
    switch (type) {
      case 'ice-bath': return [60, 120, 180, 300]
      case 'cold-plunge': return [30, 60, 90, 120]
      case 'sauna': return [600, 900, 1200, 1800]
      case 'jacuzzi': return [900, 1200, 1800, 2400]
      case 'contrast-therapy': return [300, 600, 900, 1200]
      default: return [60, 120, 180, 300]
    }
  }

  useEffect(() => {
    setTimeRemaining(duration)
  }, [duration])

  useEffect(() => {
    let interval: number | null = null
    
    if (isRunning && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsRunning(false)
            setIsActive(false)
            onSessionComplete(duration, sessionType, undefined, temperature, intensity)
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (!isRunning) {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining, duration, onSessionComplete, sessionType, temperature, intensity])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((duration - timeRemaining) / duration) * 100

  const handleStart = () => {
    setIsRunning(true)
    setIsActive(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsActive(false)
    setTimeRemaining(duration)
  }

  const presetTimes = getPresetTimes(sessionType)
  const tempRange = getTemperatureRange(sessionType)
  const sessionColor = getSessionColor(sessionType)
  const sessionIcon = getSessionIcon(sessionType)

  const getMotivationalMessage = () => {
    const elapsed = duration - timeRemaining
    const percentage = (elapsed / duration) * 100
    
    if (percentage < 25) return t(`timer.motivational.${sessionType}.start`) || t('timer.motivational.start')
    if (percentage < 50) return t(`timer.motivational.${sessionType}.quarter`) || t('timer.motivational.quarter')
    if (percentage < 75) return t(`timer.motivational.${sessionType}.half`) || t('timer.motivational.half')
    return t(`timer.motivational.${sessionType}.end`) || t('timer.motivational.end')
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="self-start"
      >
        ← {t('common.back')}
      </Button>

      {/* Session Type Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className={`inline-flex items-center gap-3 p-4 rounded-full bg-gradient-to-r ${sessionColor} text-white shadow-lg mb-4`}>
          {sessionIcon}
          <h2 className="text-xl font-bold">
            {t(`sessionTypes.${sessionType}.name`)}
          </h2>
        </div>
      </motion.div>

      {/* Configuration Panel */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md space-y-4"
          >
            <Card className="p-4">
              <div className="space-y-4">
                {/* Duration Presets */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    {t('timer.duration')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {presetTimes.map((time) => (
                      <Button
                        key={time}
                        variant={duration === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDuration(time)}
                        className={duration === time ? `bg-gradient-to-r ${sessionColor} text-white` : ''}
                      >
                        {time >= 60 ? `${Math.floor(time / 60)}m` : `${time}s`}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Temperature Input */}
                {tempRange && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {t('timer.temperature')} ({tempRange.min}-{tempRange.max}{tempRange.unit})
                    </Label>
                    <Input
                      type="number"
                      value={temperature || ''}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      min={tempRange.min}
                      max={tempRange.max}
                      placeholder={`${tempRange.min}-${tempRange.max}`}
                    />
                  </div>
                )}

                {/* Intensity Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    {t('timer.intensity')}
                  </Label>
                  <Select value={intensity} onValueChange={(value: 'low' | 'medium' | 'high') => setIntensity(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('intensity.low')}</SelectItem>
                      <SelectItem value="medium">{t('intensity.medium')}</SelectItem>
                      <SelectItem value="high">{t('intensity.high')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Display */}
      <motion.div layout className="relative">
        <Card className={`p-8 bg-gradient-to-br from-white via-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-50/30 to-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'orange' : 'indigo'}-50/50 border-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-100 shadow-2xl`}>
          <div className="relative w-64 h-64 mx-auto">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-200`}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#sessionGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out drop-shadow-sm"
              />
              <defs>
                <linearGradient id="sessionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={sessionType === 'sauna' || sessionType === 'jacuzzi' ? '#EF4444' : '#3B82F6'} />
                  <stop offset="100%" stopColor={sessionType === 'sauna' || sessionType === 'jacuzzi' ? '#F97316' : '#6366F1'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={timeRemaining}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <span className="text-5xl font-bold bg-gradient-to-br from-gray-900 to-blue-900 bg-clip-text text-transparent tracking-tight">
                  {formatTime(timeRemaining)}
                </span>
                <div className="flex items-center justify-center mt-2 gap-1">
                  <div className={`${isRunning ? 'animate-pulse' : ''}`}>
                    {sessionIcon}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {isActive ? t('timer.active') : t('timer.ready')}
                  </span>
                </div>
                {temperature && (
                  <Badge variant="secondary" className="mt-2">
                    {temperature}°C
                  </Badge>
                )}
              </motion.div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Progress value={progress} className={`h-2 ${sessionColor}`} />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{formatTime(duration - timeRemaining)} {t('timer.elapsed')}</span>
                <span>{Math.round(progress)}% {t('timer.complete')}</span>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <AnimatePresence mode="wait">
          {!isRunning ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg px-8 h-12"
              >
                <Play className="mr-2" />
                {t('timer.startSession')}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="pause"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                onClick={handlePause}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg px-8 h-12"
              >
                <Pause className="mr-2" />
                {t('timer.pause')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                onClick={handleStop}
                size="lg"
                variant="destructive"
                className="shadow-lg px-8 h-12"
              >
                <Square className="mr-2" />
                {t('timer.stop')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Motivational Message */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-3 max-w-md"
          >
            <motion.p
              key={getMotivationalMessage()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              {getMotivationalMessage()}
            </motion.p>
            <div className={`bg-gradient-to-r from-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-50 to-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'orange' : 'indigo'}-50 rounded-xl p-4 border border-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-100`}>
              <p className={`text-sm text-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-700 font-medium`}>
                {t('timer.sessionTime')}: {formatTime(duration - timeRemaining)}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className={`text-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-600`}>
                  {t(`intensity.${intensity}`)} {t('timer.intensity')}
                </span>
                {temperature && (
                  <span className={`text-${sessionType === 'sauna' || sessionType === 'jacuzzi' ? 'red' : 'blue'}-600`}>
                    {temperature}°C
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}