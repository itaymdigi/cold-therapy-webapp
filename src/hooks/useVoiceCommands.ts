import { useEffect } from 'react'
import { useVoiceRecognition } from './useVoiceRecognition'
import { useLanguage } from '@/contexts/LanguageContext'

interface VoiceCommand {
  command: 'start' | 'pause' | 'stop' | 'set_duration'
  duration?: number
}

interface UseVoiceCommandsProps {
  onCommand: (command: VoiceCommand) => void
  isActive?: boolean
}

export function useVoiceCommands({ onCommand, isActive = true }: UseVoiceCommandsProps) {
  const { language } = useLanguage()
  const { transcript, isListening, isSupported, startListening, stopListening, error } = useVoiceRecognition()

  useEffect(() => {
    if (transcript && isActive) {
      const command = parseVoiceCommand(transcript)
      if (command) {
        onCommand(command)
      }
    }
  }, [transcript, onCommand, isActive])

  const parseVoiceCommand = (text: string): VoiceCommand | null => {
    const cleanText = text.toLowerCase().trim()
    
    if (language === 'he') {
      // Hebrew commands
      if (cleanText.includes('התחל') || cleanText.includes('תתחיל') || cleanText.includes('בואי')) {
        return { command: 'start' }
      }
      
      if (cleanText.includes('השהה') || cleanText.includes('עצור') || cleanText.includes('חכה')) {
        return { command: 'pause' }
      }
      
      if (cleanText.includes('הפסק') || cleanText.includes('סיים') || cleanText.includes('בטל')) {
        return { command: 'stop' }
      }
      
      // Hebrew duration commands
      const hebrewDuration = parseHebrewDurationCommand(cleanText)
      if (hebrewDuration) {
        return { command: 'set_duration', duration: hebrewDuration }
      }
    } else {
      // English commands
      if (cleanText.includes('start') || cleanText.includes('begin') || cleanText.includes('go')) {
        return { command: 'start' }
      }
      
      if (cleanText.includes('pause') || cleanText.includes('wait') || cleanText.includes('hold')) {
        return { command: 'pause' }
      }
      
      if (cleanText.includes('stop') || cleanText.includes('end') || cleanText.includes('finish') || cleanText.includes('cancel')) {
        return { command: 'stop' }
      }
      
      // English duration setting commands
      const durationMatch = parseDurationCommand(cleanText)
      if (durationMatch) {
        return { command: 'set_duration', duration: durationMatch }
      }
    }
    
    return null
  }

  const parseHebrewDurationCommand = (text: string): number | null => {
    // Match Hebrew patterns like "קבע טיימר ל-3 דקות", "3 דקות", etc.
    const patterns = [
      /(?:קבע|טיימר|זמן)\s*(?:ל|של)?\s*(\d+)\s*(?:דקה|דקות|ד)/i,
      /(\d+)\s*(?:דקה|דקות|ד)/i,
      /(?:קבע|טיימר|זמן)\s*(?:ל|של)?\s*(\d+)\s*(?:שנייה|שניות|ש)/i,
      /(\d+)\s*(?:שנייה|שניות|ש)/i
    ]
    
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        const number = parseInt(match[1])
        if (number > 0) {
          // If the pattern includes "שנייה" or "שניות", return seconds, otherwise assume minutes
          if (pattern.source.includes('שנייה') || pattern.source.includes('שניות')) {
            return number
          } else {
            return number * 60 // Convert minutes to seconds
          }
        }
      }
    }
    
    return null
  }

  const parseDurationCommand = (text: string): number | null => {
    // Match patterns like "set timer to 3 minutes", "3 minutes", "set 5 min", etc.
    const patterns = [
      /(?:set|timer|time)\s*(?:to|for)?\s*(\d+)\s*(?:minute|minutes|min|m)/i,
      /(\d+)\s*(?:minute|minutes|min|m)/i,
      /(?:set|timer|time)\s*(?:to|for)?\s*(\d+)\s*(?:second|seconds|sec|s)/i,
      /(\d+)\s*(?:second|seconds|sec|s)/i
    ]
    
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        const number = parseInt(match[1])
        if (number > 0) {
          // If the pattern includes "second", return seconds, otherwise assume minutes
          if (pattern.source.includes('second')) {
            return number
          } else {
            return number * 60 // Convert minutes to seconds
          }
        }
      }
    }
    
    return null
  }

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    error,
    lastTranscript: transcript
  }
}