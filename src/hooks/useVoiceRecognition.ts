import { useState, useEffect, useCallback, useRef } from 'react'

interface VoiceRecognitionHook {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
  error: string | null
}

export function useVoiceRecognition(): VoiceRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript.toLowerCase().trim()
        setTranscript(result)
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        let errorMessage = 'Speech recognition error'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Try again.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Check permissions.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.'
            break
          case 'network':
            errorMessage = 'Network error. Check your connection.'
            break
          default:
            errorMessage = event.error
        }
        
        setError(errorMessage)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
      setError('Speech recognition not supported in this browser. Try Chrome, Edge, or Safari.')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = useCallback(async () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setError(null)
      
      // Check microphone permission
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          if (permission.state === 'denied') {
            setError('Microphone access denied. Please allow microphone access in your browser settings.')
            return
          }
        }
      } catch (permError) {
        // Permission API not supported, continue anyway
      }
      
      try {
        recognitionRef.current.start()
      } catch (err) {
        setError('Failed to start speech recognition. Try refreshing the page.')
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    error
  }
}