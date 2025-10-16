import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PencilSimple, Clock, Calendar, Trash } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

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

interface EditSessionDialogProps {
  isOpen: boolean
  onClose: () => void
  session: Session | null
  onSave: (updatedSession: Session) => void
  onDelete: (sessionId: string) => void
}

export function EditSessionDialog({ 
  isOpen, 
  onClose, 
  session,
  onSave,
  onDelete
}: EditSessionDialogProps) {
  const [notes, setNotes] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(0)
  const [durationSeconds, setDurationSeconds] = useState(0)

  useEffect(() => {
    if (session) {
      setNotes(session.notes || '')
      setSelectedMood(session.mood || '')
      setDurationMinutes(Math.floor(session.duration / 60))
      setDurationSeconds(session.duration % 60)
    }
  }, [session])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs} seconds`
    return `${mins} minute${mins > 1 ? 's' : ''} ${secs > 0 ? `${secs} seconds` : ''}`
  }

  const moods = [
    { 
      id: 'great', 
      label: 'Energized', 
      emoji: '⚡', 
      color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
      hoverColor: 'hover:from-green-200 hover:to-emerald-200'
    },
    { 
      id: 'good', 
      label: 'Strong', 
      emoji: '💪', 
      color: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200',
      hoverColor: 'hover:from-blue-200 hover:to-indigo-200'
    },
    { 
      id: 'tough', 
      label: 'Challenged', 
      emoji: '😤', 
      color: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200',
      hoverColor: 'hover:from-amber-200 hover:to-orange-200'
    },
    { 
      id: 'brutal', 
      label: 'Survived', 
      emoji: '🥶', 
      color: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200',
      hoverColor: 'hover:from-purple-200 hover:to-violet-200'
    }
  ]

  const handleSave = () => {
    if (!session) return

    const totalSeconds = (durationMinutes * 60) + durationSeconds
    if (totalSeconds <= 0) return

    const updatedSession: Session = {
      ...session,
      duration: totalSeconds,
      notes: notes || undefined,
      mood: selectedMood || undefined
    }

    onSave(updatedSession)
    onClose()
  }

  const handleDelete = () => {
    if (!session) return
    onDelete(session.id)
    onClose()
  }

  const handleClose = () => {
    // Reset form when closing
    setNotes('')
    setSelectedMood('')
    setDurationMinutes(0)
    setDurationSeconds(0)
    onClose()
  }

  if (!session) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border-blue-100 mx-3">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <DialogTitle className="flex items-center gap-2 text-center justify-center mb-2">
              <PencilSimple className="text-blue-500" size={20} />
              <span className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Edit Session
              </span>
            </DialogTitle>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>{format(new Date(session.completedAt), 'MMM d, yyyy • h:mm a')}</span>
            </div>
          </motion.div>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 pt-2"
        >
          {/* Duration Input - Mobile optimized */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Duration</label>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
              <Clock className="text-blue-600" size={18} />
              <div className="flex items-center gap-1 flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-14 text-center bg-white border-blue-200 text-sm"
                />
                <span className="text-blue-700 font-medium text-sm">m</span>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-14 text-center bg-white border-blue-200 text-sm"
                />
                <span className="text-blue-700 font-medium text-sm">s</span>
              </div>
            </div>
          </div>

          {/* Mood Selection - Mobile optimized */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">How did it feel?</label>
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
                      onClick={() => setSelectedMood(selectedMood === mood.id ? '' : mood.id)}
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
              Reflections (optional)
            </label>
            <Textarea
              placeholder="What did you learn? How do you feel? Any goals for next time?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-white/80 border-blue-100 focus:border-blue-300 resize-none text-sm"
            />
          </div>

          {/* Actions - Mobile optimized with proper touch targets */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              className="flex items-center gap-1 min-h-[44px] px-3"
            >
              <Trash size={14} />
              <span className="text-sm">Delete</span>
            </Button>
            <div className="flex gap-2 flex-1">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1 bg-white hover:bg-gray-50 border-gray-200 min-h-[44px] text-sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={(durationMinutes * 60) + durationSeconds <= 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg disabled:opacity-50 min-h-[44px] text-sm"
              >
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}