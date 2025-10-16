import React from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from '@phosphor-icons/react'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en')
  }

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 h-8 px-3"
    >
      <Globe size={14} />
      <span className="text-xs font-medium">
        {language === 'en' ? 'עברית' : 'English'}
      </span>
    </Button>
  )
}