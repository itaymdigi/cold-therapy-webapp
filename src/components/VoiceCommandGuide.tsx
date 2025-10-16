import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Info, Microphone } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export function VoiceCommandGuide() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const commands = [
    {
      category: 'Timer Control',
      commands: [
        { phrase: t('dialogs.voiceGuide.commands.start'), action: 'Starts the timer' },
        { phrase: t('dialogs.voiceGuide.commands.pause'), action: 'Pauses the timer' },
        { phrase: t('dialogs.voiceGuide.commands.stop'), action: 'Stops and resets the timer' }
      ]
    },
    {
      category: 'Duration Setting',
      commands: [
        { phrase: t('dialogs.voiceGuide.commands.setTimer'), action: 'Sets timer to specified time' }
      ]
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          <Info size={16} className="mr-1" />
          {t('timer.voiceControl')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Microphone size={20} className="text-blue-600" />
            {t('dialogs.voiceGuide.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {commands.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card className="p-3 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-100">
                <h4 className="font-medium text-sm text-blue-800 mb-2">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.commands.map((cmd, cmdIndex) => (
                    <div key={cmdIndex} className="text-xs">
                      <code className="bg-white/60 px-2 py-1 rounded text-blue-700 font-mono block mb-1">
                        {cmd.phrase}
                      </code>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
          
          <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3">
            <div className="space-y-1">
              <p className="text-xs text-amber-700 font-medium">
                {t('dialogs.voiceGuide.tips.title')}:
              </p>
              <p className="text-xs text-amber-700">
                • {t('dialogs.voiceGuide.tips.clear')}
              </p>
              <p className="text-xs text-amber-700">
                • {t('dialogs.voiceGuide.tips.quiet')}
              </p>
              <p className="text-xs text-amber-700">
                • {t('dialogs.voiceGuide.tips.wait')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}