import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Trophy, Thermometer, Sparkle, Snowflake } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface SessionCompleteDialogProps {
  isOpen: boolean
  onClose: () => void
  duration: number
  onSave: (notes: string, mood: string) => void
}

export function SessionCompleteDialog({ 
  isOpen, 
  onClose, 
  duration, 
  onSave 
}: SessionCompleteDialogProps) {
  const { t } = useLanguage()
  const [notes, setNotes] = useState('')
  const [selectedMood, setSelectedMood] = useState('')

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs} seconds`
    return `${mins} minute${mins > 1 ? 's' : ''} ${secs > 0 ? `${secs} seconds` : ''}`
  }

  const getEncouragementMessage = () => {
    if (duration >= 300) return "Incredible! You're a cold warrior! 🏆"
    if (duration >= 180) return "Outstanding resilience! 💪"
    if (duration >= 120) return "Great job pushing through! 🔥"
    return "Every second matters! Keep building! 🧊"
  }

  const moods = [
    { 
      id: 'energized', 
      label: t('dialogs.sessionComplete.moodOptions.energized'), 
      emoji: '😤', 
      color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
      hoverColor: 'hover:from-green-200 hover:to-emerald-200'
    },
    { 
      id: 'accomplished', 
      label: t('dialogs.sessionComplete.moodOptions.accomplished'), 
      emoji: '💪', 
      color: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200',
      hoverColor: 'hover:from-blue-200 hover:to-indigo-200'
    },
    { 
      id: 'calm', 
      label: t('dialogs.sessionComplete.moodOptions.calm'), 
      emoji: '😌', 
      color: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200',
      hoverColor: 'hover:from-amber-200 hover:to-orange-200'
    },
    { 
      id: 'strong', 
      label: t('dialogs.sessionComplete.moodOptions.strong'), 
      emoji: '🔥', 
      color: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200',
      hoverColor: 'hover:from-purple-200 hover:to-violet-200'
    }
  ]

  const handleSave = () => {
    onSave(notes, selectedMood)
    setNotes('')
    setSelectedMood('')
    onClose()
  }

  const handleSkip = () => {
    onSave('', '')
    setNotes('')
    setSelectedMood('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border-blue-100 mx-3">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <DialogTitle className="flex items-center gap-2 text-center justify-center mb-2">
              <div className="relative">
                <Trophy className="text-amber-500" size={28} />
                <Sparkle 
                  size={14} 
                  className="absolute -top-1 -right-1 text-amber-400 animate-pulse" 
                />
              </div>
              <span className="text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {t('dialogs.sessionComplete.title')}
              </span>
            </DialogTitle>
            <p className="text-blue-600 font-medium text-sm">{getEncouragementMessage()}</p>
          </motion.div>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 pt-2"
        >
          {/* Duration Display - Mobile optimized */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="relative">
                <Thermometer className="text-blue-600" size={24} />
                <Snowflake 
                  size={12} 
                  className="absolute -top-1 -right-1 text-indigo-400 animate-spin" 
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {formatDuration(duration)}
              </span>
            </div>
            <p className="text-blue-700 text-xs font-medium">
              {t('dialogs.sessionComplete.wellDone')}
            </p>
          </div>

          {/* Mood Selection - Mobile optimized with larger touch targets */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">{t('dialogs.sessionComplete.mood')}</label>
            <div className="grid grid-cols-2 gap-2">
              <AnimatePresence>
                {moods.map((mood, index) => (
                  <motion.div
                    key={mood.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Badge
                      variant="outline"
                      className={`cursor-pointer p-3 text-center justify-center flex flex-col gap-1 h-auto transition-all min-h-[60px] ${
                        selectedMood === mood.id 
                          ? `${mood.color} border-2 shadow-lg` 
                          : `bg-white hover:bg-gray-50 ${mood.hoverColor} border-gray-200`
                      }`}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      <span className="text-xl">{mood.emoji}</span>
                      <span className="text-xs font-medium">{mood.label}</span>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Notes - Mobile optimized */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('dialogs.sessionComplete.addNotes')}
            </label>
            <Textarea
              placeholder={t('dialogs.sessionComplete.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-white/80 border-blue-100 focus:border-blue-300 resize-none text-sm"
            />
          </div>

          {/* Actions - Mobile optimized with better spacing */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={handleSkip} 
              className="flex-1 bg-white hover:bg-gray-50 border-gray-200 min-h-[44px]"
            >
              {t('dialogs.sessionComplete.skip')}
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg min-h-[44px]"
            >
              {t('dialogs.sessionComplete.save')}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}