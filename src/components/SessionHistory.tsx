import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Thermometer, Clock, Calendar, Snowflake, TrendUp, DotsThree, PencilSimple, Trash, Wind, Fire, Sun, Waves, ArrowsClockwise } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import React, { useState, useMemo } from 'react'

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

interface SessionHistoryProps {
  sessions: Session[]
  onEditSession?: (session: Session) => void
  onDeleteSession?: (sessionId: string) => void
}

export function SessionHistory({ sessions, onEditSession, onDeleteSession }: SessionHistoryProps) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<'all' | Session['type']>('all')

  const getSessionIcon = (type: Session['type']) => {
    switch (type) {
      case 'ice-bath': return <Snowflake size={20} />
      case 'cold-plunge': return <Waves size={20} />
      case 'sauna': return <Fire size={20} />
      case 'jacuzzi': return <Sun size={20} />
      case 'contrast-therapy': return <ArrowsClockwise size={20} />
      case 'breathing': return <Wind size={20} />
      default: return <Thermometer size={20} />
    }
  }

  const getSessionColor = (type: Session['type']) => {
    switch (type) {
      case 'ice-bath': return 'text-blue-600 bg-blue-100'
      case 'cold-plunge': return 'text-cyan-600 bg-cyan-100'
      case 'sauna': return 'text-red-600 bg-red-100'
      case 'jacuzzi': return 'text-amber-600 bg-amber-100'
      case 'contrast-therapy': return 'text-purple-600 bg-purple-100'
      case 'breathing': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes === 0) return `${remainingSeconds}s`
    if (remainingSeconds === 0) return `${minutes}m`
    return `${minutes}m ${remainingSeconds}s`
  }

  const filteredSessions = useMemo(() => {
    return filter === 'all' ? sessions : sessions.filter(session => session.type === filter)
  }, [sessions, filter])

  // Empty state
  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border-blue-100">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <Thermometer size={64} className="text-blue-400" />
              <Snowflake 
                size={24} 
                className="absolute -top-2 -right-2 text-indigo-400 animate-pulse" 
              />
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              No Sessions Yet
            </h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Start your first wellness session to begin tracking your progress
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const totalSessions = sessions.length
  const iceBathSessions = sessions.filter(s => s.type === 'ice-bath')
  const breathingSessions = sessions.filter(s => s.type === 'breathing')
  const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0)
  const averageTime = Math.round(totalTime / totalSessions)
  const longestSession = Math.max(...sessions.map(s => s.duration))
  const recentSessions = sessions.slice(-7) // Last 7 sessions
  const improvement = recentSessions.length > 1 ? 
    ((recentSessions[recentSessions.length - 1].duration - recentSessions[0].duration) / recentSessions[0].duration) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Beautiful Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          Session History
        </h2>
        <p className="text-sm text-muted-foreground">
          Track your wellness journey and progress
        </p>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3"
      >
        {/* Total Sessions */}
        <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200/50 shadow-lg shadow-blue-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
              {totalSessions}
            </div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
              Total Sessions
            </div>
            <div className="text-xs text-blue-600 mt-1 flex items-center justify-center gap-2">
              <span>🧊 {iceBathSessions.length}</span>
              <span>💨 {breathingSessions.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Duration */}
        <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200/50 shadow-lg shadow-emerald-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
              {formatDuration(averageTime)}
            </div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Average Time
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              Personal Best: {formatDuration(longestSession)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Indicator */}
      {improvement !== 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`${
            improvement > 0 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50' 
              : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200/50'
          } shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    improvement > 0 
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-500 text-white'
                  }`}>
                    <TrendUp size={16} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${
                      improvement > 0 ? 'text-green-800' : 'text-orange-800'
                    }`}>
                      {improvement > 0 ? 'Progress Detected!' : 'Keep Building'}
                    </div>
                    <div className={`text-xs ${
                      improvement > 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      Recent session trend
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-bold ${
                  improvement > 0 ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {improvement > 0 ? '+' : ''}{improvement.toFixed(0)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {['all', 'ice-bath', 'breathing', 'sauna', 'contrast-therapy'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType as any)}
            className={`${
              filter === filterType
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/80 backdrop-blur-sm hover:bg-blue-50'
            } px-4 py-2 rounded-full text-xs font-medium transition-all duration-300`}
          >
            {filterType === 'all' ? 'All' : (filterType || '').replace('-', ' ')}
          </Button>
        ))}
      </motion.div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.slice(0, 10).map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* Session Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-xl ${getSessionColor(session.type)} shadow-sm`}>
                      {getSessionIcon(session.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {(session.type || '').replace('-', ' ')}
                        </h4>
                        {session.technique && (
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {session.technique}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span className="font-medium">{formatDuration(session.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{format(new Date(session.completedAt), 'MMM d')}</span>
                        </div>
                        {session.temperature && (
                          <div className="flex items-center gap-1">
                            <Thermometer size={12} />
                            <span>{session.temperature}°C</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(onEditSession || onDeleteSession) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <DotsThree size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEditSession && (
                          <DropdownMenuItem onClick={() => onEditSession(session)}>
                            <PencilSimple className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDeleteSession && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Session</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this session? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteSession(session.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Notes preview */}
                {session.notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {session.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Show more button if there are more sessions */}
      {filteredSessions.length > 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button
            variant="outline"
            className="bg-white/80 backdrop-blur-sm hover:bg-blue-50"
          >
            View All {filteredSessions.length} Sessions
          </Button>
        </motion.div>
      )}
    </div>
  )
}