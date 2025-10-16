import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, Square, Snowflake, Microphone, MicrophoneSlash } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'
import { VoiceCommandGuide } from '@/components/VoiceCommandGuide'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'

interface TimerProps {
  onSessionComplete: (duration: number) => void
}

export function Timer({ onSessionComplete }: TimerProps) {
  const { t } = useLanguage()
  const [duration, setDuration] = useState(120) // Default 2 minutes
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [voiceCommandProcessed, setVoiceCommandProcessed] = useState(false)

  // Voice command integration
  const { isListening, isSupported, startListening, stopListening, error, lastTranscript } = useVoiceCommands({
    onCommand: (command) => {
      setVoiceCommandProcessed(true)
      setTimeout(() => setVoiceCommandProcessed(false), 2000)
      
      switch (command.command) {
        case 'start':
          if (!isRunning) {
            handleStart()
            toast.success(t('timer.voiceCommands.startTimer'))
          }
          break
        case 'pause':
          if (isRunning) {
            handlePause()
            toast.success(t('timer.voiceCommands.pauseTimer'))
          }
          break
        case 'stop':
          if (isActive) {
            handleStop()
            toast.success(t('timer.voiceCommands.stopTimer'))
          }
          break
        case 'set_duration':
          if (command.duration && !isActive) {
            setDuration(command.duration)
            const timeStr = command.duration < 60 ? `${command.duration}s` : `${Math.floor(command.duration / 60)}m ${command.duration % 60}s`
            toast.success(t('timer.voiceCommands.setDuration', { duration: timeStr }))
          }
          break
      }
    },
    isActive: true
  })

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
            onSessionComplete(duration)
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
  }, [isRunning, timeRemaining, duration, onSessionComplete])

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

  const presetTimes = [60, 120, 180, 300, 600] // 1min, 2min, 3min, 5min, 10min

  const getMotivationalMessage = () => {
    const elapsed = duration - timeRemaining
    const percentage = (elapsed / duration) * 100
    
    if (percentage < 25) return t('timer.motivational.start')
    if (percentage < 50) return t('timer.motivational.quarter')
    if (percentage < 75) return t('timer.motivational.half')
    return t('timer.motivational.end')
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Voice Control Section - Enhanced Mobile Design */}
      {isSupported && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center space-y-3"
        >
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            className={`${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg' 
                : 'bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300'
            } transition-all duration-300 px-4 py-2 rounded-full`}
          >
            {isListening ? (
              <>
                <MicrophoneSlash className="mr-2" size={16} />
                {t('timer.stopListening')}
              </>
            ) : (
              <>
                <Microphone className="mr-2" size={16} />
                {t('timer.voiceControl')}
              </>
            )}
          </Button>
          
          <VoiceCommandGuide />
          
          {/* Enhanced Voice Feedback */}
          <div className="min-h-[30px] px-4">
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <p className="text-sm text-red-600 font-medium">
                  {t('timer.listening')}
                </p>
              </motion.div>
            )}
            {lastTranscript && !isListening && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm px-3 py-1 rounded-full ${
                  voiceCommandProcessed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                } transition-all duration-300`}
              >
                {voiceCommandProcessed && '✅ '}{lastTranscript}
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full"
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}

      {/* Enhanced Duration Presets */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <p className="text-sm font-medium text-muted-foreground text-center mb-3">
              {t('timer.chooseDuration')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-full">
              {presetTimes.map((time, index) => (
                <motion.div
                  key={time}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={duration === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration(time)}
                    className={`${
                      duration === time 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                        : 'bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300'
                    } transition-all duration-300 px-4 py-2 rounded-full font-medium`}
                  >
                    {time < 60 ? `${time}s` : `${time / 60}m`}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathtaking Timer Display */}
      <motion.div
        layout
        className="relative w-full max-w-xs"
      >
        <Card className="relative overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/20">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50" />
          
          <div className="relative p-8">
            <div className="relative w-56 h-56 mx-auto">
              {/* Animated outer ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 animate-pulse" />
              
              {/* Progress Ring */}
              <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-blue-200/50"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className="filter drop-shadow-lg"
                  style={{
                    transition: 'stroke-dashoffset 1s ease-out'
                  }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Central Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Main time display */}
                <motion.div
                  key={timeRemaining}
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold bg-gradient-to-br from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent tracking-tight mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }}
                    >
                      <Snowflake 
                        size={18} 
                        className="text-blue-500"
                        weight={isRunning ? 'fill' : 'regular'}
                      />
                    </motion.div>
                    <span className="text-sm font-semibold text-blue-700">
                      {isActive ? t('timer.active') : t('timer.ready')}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced Progress Information */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-3"
              >
                <Progress 
                  value={progress} 
                  className="h-2 bg-blue-100"
                />
                <div className="flex justify-between items-center text-xs">
                  <div className="text-blue-600 font-medium">
                    {formatTime(duration - timeRemaining)} elapsed
                  </div>
                  <div className="text-indigo-600 font-bold">
                    {Math.round(progress)}%
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Beautiful Control Buttons */}
      <div className="flex gap-3 w-full justify-center">
        <AnimatePresence mode="wait">
          {!isRunning ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                <Play className="mr-2" size={20} />
                {t('timer.startSession')}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="pause"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handlePause}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                <Pause className="mr-2" size={20} />
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleStop}
                size="lg"
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-xl px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                <Square className="mr-2" size={20} />
                {t('timer.stop')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Motivational Section */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full text-center space-y-4"
          >
            {/* Motivational message */}
            <motion.div
              key={getMotivationalMessage()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              <p className="text-lg font-bold leading-tight">
                {getMotivationalMessage()}
              </p>
            </motion.div>
            
            {/* Stats card */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 rounded-2xl p-5 border border-blue-100/50 shadow-lg backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-semibold text-blue-800">
                    {t('timer.timeInCold')}
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatTime(duration - timeRemaining)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">
                    {t('timer.buildingResilience')}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <Snowflake size={14} className="text-blue-500" />
                    <span className="text-sm font-bold text-blue-700">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}