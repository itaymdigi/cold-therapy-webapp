import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Thermometer, Trophy, User, Wind } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userPicture?: string
  userName?: string
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useLanguage()

  const menuItems = [
    { id: 'timer', label: t('tabs.timer'), icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'breathing', label: t('tabs.breathing'), icon: Wind, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'history', label: t('tabs.history'), icon: Thermometer, gradient: 'from-indigo-500 to-purple-500' },
    { id: 'achievements', label: t('tabs.progress'), icon: Trophy, gradient: 'from-amber-500 to-orange-500' },
    { id: 'profile', label: t('tabs.profile'), icon: User, gradient: 'from-pink-500 to-rose-500' },
  ]

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-2xl shadow-blue-500/10"
    >
      <div className="flex items-center justify-around px-2 py-3 max-w-sm mx-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Active indicator background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-15`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon container with gradient background when active */}
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                  : 'bg-gray-100/50'
              }`}>
                <item.icon 
                  size={20} 
                  weight={isActive ? 'fill' : 'regular'}
                  className={isActive ? 'text-white' : 'text-gray-600'}
                />
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isActive ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
              
              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-1 h-1 bg-gradient-to-r ${item.gradient} rounded-full`}
                />
              )}
            </motion.button>
          )
        })}
      </div>
      
      {/* Safe area padding for phones with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </motion.div>
  )
}