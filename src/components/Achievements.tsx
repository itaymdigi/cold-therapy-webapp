import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Flame, Target, Medal, Star, Crown, Snowflake, Lightning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ElementType
  unlocked: boolean
  progress?: number
  maxProgress?: number
  category: 'duration' | 'consistency' | 'frequency' | 'milestone'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface AchievementsProps {
  sessions: Array<{ 
    duration: number; 
    completedAt: string; 
    type: 'ice-bath' | 'breathing' | 'sauna' | 'jacuzzi' | 'cold-plunge' | 'contrast-therapy';
    temperature?: number;
    intensity?: 'low' | 'medium' | 'high';
  }>
}

export function Achievements({ sessions }: AchievementsProps) {
  const calculateStreak = () => {
    if (sessions.length === 0) return 0
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let streak = 0
    let currentDate = new Date(today)
    
    const sessionDates = sessions
      .map(s => {
        const date = new Date(s.completedAt)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
      .sort((a, b) => b - a)
    
    const uniqueDates = Array.from(new Set(sessionDates))
    
    for (const sessionDate of uniqueDates) {
      if (sessionDate === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (sessionDate === currentDate.getTime() + 86400000) {
        if (streak === 0) {
          streak++
          currentDate.setDate(currentDate.getDate() - 2)
        } else {
          break
        }
      } else {
        break
      }
    }
    
    return streak
  }

  const currentStreak = calculateStreak()
  const totalSessions = sessions.length
  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const longestSession = sessions.length > 0 ? Math.max(...sessions.map(s => s.duration)) : 0

  const achievements: Achievement[] = [
    {
      id: 'first-plunge',
      title: 'First Plunge',
      description: 'Welcome to the cold! Your journey begins.',
      icon: Snowflake,
      unlocked: totalSessions >= 1,
      category: 'milestone',
      rarity: 'common'
    },
    {
      id: 'ice-initiate',
      title: 'Ice Initiate',
      description: 'Complete 5 sessions and embrace the cold',
      icon: Lightning,
      unlocked: totalSessions >= 5,
      progress: Math.min(totalSessions, 5),
      maxProgress: 5,
      category: 'frequency',
      rarity: 'common'
    },
    {
      id: 'ice-warrior',
      title: 'Ice Warrior',
      description: 'Show dedication with 10 cold sessions',
      icon: Medal,
      unlocked: totalSessions >= 10,
      progress: Math.min(totalSessions, 10),
      maxProgress: 10,
      category: 'frequency',
      rarity: 'rare'
    },
    {
      id: 'polar-champion',
      title: 'Polar Champion',
      description: 'Master the cold with 25 sessions',
      icon: Trophy,
      unlocked: totalSessions >= 25,
      progress: Math.min(totalSessions, 25),
      maxProgress: 25,
      category: 'frequency',
      rarity: 'epic'
    },
    {
      id: 'arctic-legend',
      title: 'Arctic Legend',
      description: 'Legendary status with 50 sessions',
      icon: Crown,
      unlocked: totalSessions >= 50,
      progress: Math.min(totalSessions, 50),
      maxProgress: 50,
      category: 'frequency',
      rarity: 'legendary'
    },
    {
      id: 'one-minute-milestone',
      title: 'One Minute Milestone',
      description: 'Endure 60 seconds of pure cold',
      icon: Target,
      unlocked: longestSession >= 60,
      category: 'duration',
      rarity: 'common'
    },
    {
      id: 'two-minute-mark',
      title: 'Two Minute Warrior',
      description: 'Master 2 minutes of ice cold endurance',
      icon: Target,
      unlocked: longestSession >= 120,
      category: 'duration',
      rarity: 'rare'
    },
    {
      id: 'five-minute-hero',
      title: 'Five Minute Hero',
      description: 'Epic endurance - 5 minutes of cold mastery',
      icon: Star,
      unlocked: longestSession >= 300,
      category: 'duration',
      rarity: 'epic'
    },
    {
      id: 'iron-mind',
      title: 'Iron Mind',
      description: 'Legendary - survive 10 minutes in the ice',
      icon: Crown,
      unlocked: longestSession >= 600,
      category: 'duration',
      rarity: 'legendary'
    },
    {
      id: 'weekly-warrior',
      title: 'Weekly Warrior',
      description: 'Maintain consistent practice for 7 days',
      icon: Flame,
      unlocked: currentStreak >= 7,
      progress: Math.min(currentStreak, 7),
      maxProgress: 7,
      category: 'consistency',
      rarity: 'rare'
    },
    {
      id: 'consistency-champion',
      title: 'Consistency Champion',
      description: 'Epic dedication - 21 day streak',
      icon: Trophy,
      unlocked: currentStreak >= 21,
      progress: Math.min(currentStreak, 21),
      maxProgress: 21,
      category: 'consistency',
      rarity: 'epic'
    },
    {
      id: 'ice-sage',
      title: 'Ice Sage',
      description: 'Legendary consistency - 30 day streak',
      icon: Crown,
      unlocked: currentStreak >= 30,
      progress: Math.min(currentStreak, 30),
      maxProgress: 30,
      category: 'consistency',
      rarity: 'legendary'
    }
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalAchievements = achievements.length

  const getRarityColors = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return {
          bg: 'from-gray-100 to-slate-100',
          border: 'border-gray-200',
          text: 'text-gray-700',
          glow: 'shadow-gray-200/50'
        }
      case 'rare':
        return {
          bg: 'from-blue-100 to-indigo-100',
          border: 'border-blue-200',
          text: 'text-blue-700',
          glow: 'shadow-blue-200/50'
        }
      case 'epic':
        return {
          bg: 'from-purple-100 to-violet-100',
          border: 'border-purple-200',
          text: 'text-purple-700',
          glow: 'shadow-purple-200/50'
        }
      case 'legendary':
        return {
          bg: 'from-amber-100 to-orange-100',
          border: 'border-amber-200',
          text: 'text-amber-700',
          glow: 'shadow-amber-200/50'
        }
    }
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'duration': return '⏱️'
      case 'consistency': return '🔥'
      case 'frequency': return '📈'
      case 'milestone': return '🎯'
    }
  }

  return (
    <div className="space-y-6">
      {/* Achievement Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 border-amber-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="relative">
                <Trophy className="text-amber-600" size={28} />
                <Star size={14} className="absolute -top-1 -right-1 text-orange-400 animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Achievement Progress
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-amber-700">Overall Progress</span>
              <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {unlockedCount}/{totalAchievements}
              </span>
            </div>
            <Progress value={(unlockedCount / totalAchievements) * 100} className="mb-6 h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {currentStreak}
                </div>
                <div className="text-xs text-blue-600 font-medium">Day Streak</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {unlockedCount}
                </div>
                <div className="text-xs text-emerald-600 font-medium">Unlocked</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {Math.round((totalTime / 60) * 10) / 10}m
                </div>
                <div className="text-xs text-purple-600 font-medium">Total Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement List */}
      <div className="grid gap-4">
        {achievements.map((achievement, index) => {
          const IconComponent = achievement.icon
          const rarityColors = getRarityColors(achievement.rarity)
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`transition-all duration-300 ${
                  achievement.unlocked
                    ? `bg-gradient-to-r ${rarityColors.bg} ${rarityColors.border} shadow-lg ${rarityColors.glow} hover:scale-105`
                    : 'opacity-60 bg-gray-50 border-gray-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      achievement.unlocked 
                        ? `bg-gradient-to-br ${rarityColors.bg} ${rarityColors.border} border shadow-sm` 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <IconComponent size={24} className={achievement.unlocked ? rarityColors.text : ''} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-bold ${achievement.unlocked ? rarityColors.text : 'text-gray-500'}`}>
                          {achievement.title}
                        </h4>
                        <span className="text-sm">{getCategoryIcon(achievement.category)}</span>
                        {achievement.unlocked && (
                          <Badge 
                            variant="outline" 
                            className={`${rarityColors.bg} ${rarityColors.text} ${rarityColors.border} text-xs font-semibold`}
                          >
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                      
                      {achievement.maxProgress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className={achievement.unlocked ? rarityColors.text : 'text-gray-500'}>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                            <span className={achievement.unlocked ? rarityColors.text : 'text-gray-500'}>
                              {Math.round(((achievement.progress || 0) / achievement.maxProgress) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}