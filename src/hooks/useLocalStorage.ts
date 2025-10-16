import { useState, useEffect, Dispatch, SetStateAction } from 'react'

/**
 * Custom hook to replace @github/spark useKV with localStorage
 * Provides the same API as useKV but uses browser localStorage
 */
export function useKV<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Get stored value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
