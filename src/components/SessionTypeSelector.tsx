import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Snowflake, Thermometer, Waves, Fire, Sun, ArrowsClockwise } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export type SessionType = 'ice-bath' | 'cold-plunge' | 'sauna' | 'jacuzzi' | 'contrast-therapy' | 'breathing'

interface SessionTypeInfo {
  type: SessionType
  icon: React.ReactNode
  name: string
  description: string
  temperature?: string
  color: string
  gradient: string
  benefits: string[]
  defaultDuration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface SessionTypeSelectorProps {
  onSelect: (type: SessionType) => void
  selectedType: SessionType | null
}

export function SessionTypeSelector({ onSelect, selectedType }: SessionTypeSelectorProps) {
  const { t } = useLanguage()

  const sessionTypes: SessionTypeInfo[] = [
    {
      type: 'ice-bath',
      icon: <Snowflake size={24} />,
      name: t('sessionTypes.iceBath.name'),
      description: t('sessionTypes.iceBath.description'),
      temperature: '10-15°C',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      benefits: [t('sessionTypes.iceBath.benefit1'), t('sessionTypes.iceBath.benefit2'), t('sessionTypes.iceBath.benefit3')],
      defaultDuration: 120,
      difficulty: 'intermediate'
    },
    {
      type: 'cold-plunge',
      icon: <Waves size={24} />,
      name: t('sessionTypes.coldPlunge.name'),
      description: t('sessionTypes.coldPlunge.description'),
      temperature: '4-10°C',
      color: 'text-cyan-600',
      gradient: 'from-cyan-500 to-blue-600',
      benefits: [t('sessionTypes.coldPlunge.benefit1'), t('sessionTypes.coldPlunge.benefit2')],
      defaultDuration: 90,
      difficulty: 'advanced'
    },
    {
      type: 'sauna',
      icon: <Fire size={24} />,
      name: t('sessionTypes.sauna.name'),
      description: t('sessionTypes.sauna.description'),
      temperature: '80-100°C',
      color: 'text-red-600',
      gradient: 'from-red-500 to-orange-500',
      benefits: [t('sessionTypes.sauna.benefit1'), t('sessionTypes.sauna.benefit2'), t('sessionTypes.sauna.benefit3')],
      defaultDuration: 900,
      difficulty: 'beginner'
    },
    {
      type: 'jacuzzi',
      icon: <Sun size={24} />,
      name: t('sessionTypes.jacuzzi.name'),
      description: t('sessionTypes.jacuzzi.description'),
      temperature: '37-40°C',
      color: 'text-amber-600',
      gradient: 'from-amber-500 to-yellow-500',
      benefits: [t('sessionTypes.jacuzzi.benefit1'), t('sessionTypes.jacuzzi.benefit2')],
      defaultDuration: 1200,
      difficulty: 'beginner'
    },
    {
      type: 'contrast-therapy',
      icon: <ArrowsClockwise size={24} />,
      name: t('sessionTypes.contrastTherapy.name'),
      description: t('sessionTypes.contrastTherapy.description'),
      temperature: t('sessionTypes.contrastTherapy.temperature'),
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      benefits: [t('sessionTypes.contrastTherapy.benefit1'), t('sessionTypes.contrastTherapy.benefit2')],
      defaultDuration: 600,
      difficulty: 'advanced'
    },
    {
      type: 'breathing',
      icon: <Thermometer size={24} />,
      name: t('sessionTypes.breathing.name'),
      description: t('sessionTypes.breathing.description'),
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      benefits: [t('sessionTypes.breathing.benefit1'), t('sessionTypes.breathing.benefit2')],
      defaultDuration: 300,
      difficulty: 'beginner'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Beautiful header with subtle animation */}
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          {t('sessionTypes.title')}
        </h2>
        <p className="text-muted-foreground/80 text-sm leading-relaxed">
          {t('sessionTypes.subtitle')}
        </p>
      </motion.div>

      {/* Elegant session type cards */}
      <div className="space-y-3">
        {sessionTypes.map((sessionType, index) => (
          <motion.div
            key={sessionType.type}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedType === sessionType.type 
                  ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' 
                  : 'hover:shadow-lg shadow-gray-500/5'
              }`}
              onClick={() => onSelect(sessionType.type)}
            >
              {/* Gradient overlay for active state */}
              {selectedType === sessionType.type && (
                <div className={`absolute inset-0 bg-gradient-to-r ${sessionType.gradient} opacity-5`} />
              )}
              
              <div className="relative p-5 space-y-4">
                {/* Header section */}
                <div className="flex items-center gap-4">
                  {/* Icon with gradient background */}
                  <div className={`relative p-3 rounded-2xl bg-gradient-to-r ${sessionType.gradient} shadow-lg`}>
                    <div className="text-white">
                      {sessionType.icon}
                    </div>
                  </div>
                  
                  {/* Title and badges */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-lg text-foreground leading-tight">
                        {sessionType.name}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant="secondary" 
                          className={`${getDifficultyColor(sessionType.difficulty)} text-xs font-medium`}
                        >
                          {t(`difficulty.${sessionType.difficulty}`)}
                        </Badge>
                        {sessionType.temperature && (
                          <Badge variant="outline" className="text-xs font-mono">
                            {sessionType.temperature}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {sessionType.description}
                </p>
                
                {/* Benefits section */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">
                    {t('sessionTypes.benefits')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {sessionType.benefits.slice(0, 2).map((benefit, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs bg-gray-100/80 text-gray-700 border-0"
                      >
                        {benefit}
                      </Badge>
                    ))}
                    {sessionType.benefits.length > 2 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100/80 text-gray-600">
                        +{sessionType.benefits.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Footer with duration and action */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t('sessionTypes.defaultDuration')}: {Math.floor(sessionType.defaultDuration / 60)}min
                  </span>
                  
                  {selectedType === sessionType.type && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button 
                        size="sm" 
                        className={`bg-gradient-to-r ${sessionType.gradient} text-white shadow-md hover:shadow-lg border-0 px-4 py-2 text-xs font-semibold`}
                      >
                        {t('sessionTypes.startSession')}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}