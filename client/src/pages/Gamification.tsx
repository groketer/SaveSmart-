import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  Trophy, 
  Zap, 
  Flame,
  Users,
  Crown,
  Award,
  TrendingUp
} from 'lucide-react'
import { storage } from '@/lib/localStorage'
import type { User, Badge as BadgeType, Challenge } from '@shared/schema'

interface GamificationProps {
  user: User
}

const Gamification = ({ user }: GamificationProps) => {
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userStats, setUserStats] = useState({
    points: user.points,
    level: user.level,
    nextLevelPoints: 1500,
    streak: user.streak,
    totalBadges: user.badges.length,
    rank: 23
  })
  const [leaderboard] = useState([
    { rank: 1, name: 'Sarah M.', points: 2850, avatar: '👩' },
    { rank: 2, name: 'Mike R.', points: 2720, avatar: '👨' },
    { rank: 3, name: 'Emma L.', points: 2650, avatar: '👩‍🦰' },
    { rank: 4, name: 'You', points: user.points, avatar: '🙋‍♂️', isUser: true }
  ])

  useEffect(() => {
    const userBadges = storage.getUserBadges(user.id)
    const defaultChallenges = storage.getDefaultChallenges()
    
    setBadges(userBadges)
    setChallenges(defaultChallenges)
  }, [user.id])

  const levelProgress = (userStats.points / userStats.nextLevelPoints) * 100

  return (
    <div className="p-4 pb-20 space-y-6" data-testid="gamification-page">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Rewards & Challenges</h1>
        <p className="text-gray-600">Level up your savings game!</p>
      </div>

      {/* User Level Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-90"></div>
        <CardContent className="relative p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-user-level">Level {userStats.level}</h2>
                <p className="text-purple-100">Savings Enthusiast</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" data-testid="text-user-points">{userStats.points}</p>
              <p className="text-purple-100 text-sm">Points</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userStats.level + 1}</span>
              <span data-testid="text-level-progress">{userStats.points} / {userStats.nextLevelPoints}</span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-white bg-opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <Flame className="h-6 w-6" style={{ color: 'var(--savesmart-orange)' }} />
              <p className="text-2xl font-bold" data-testid="text-streak">{userStats.streak}</p>
              <p className="text-xs text-gray-600">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <Award className="h-6 w-6" style={{ color: 'var(--savesmart-purple)' }} />
              <p className="text-2xl font-bold" data-testid="text-badges-earned">
                {badges.filter(b => b.earned).length}
              </p>
              <p className="text-xs text-gray-600">Badges</p>
            </div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6" style={{ color: 'var(--savesmart-green)' }} />
              <p className="text-2xl font-bold" data-testid="text-rank">#{userStats.rank}</p>
              <p className="text-xs text-gray-600">Rank</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" style={{ color: 'var(--savesmart-purple)' }} />
            Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border rounded-lg p-4 space-y-3" data-testid={`challenge-${challenge.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold" data-testid={`text-challenge-title-${challenge.id}`}>
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <Badge 
                  variant={challenge.difficulty === 'Easy' ? 'secondary' : challenge.difficulty === 'Medium' ? 'default' : 'destructive'}
                  data-testid={`badge-difficulty-${challenge.id}`}
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span data-testid={`text-challenge-progress-${challenge.id}`}>{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" style={{ color: 'var(--savesmart-purple)' }} />
                  <span className="text-sm font-semibold" data-testid={`text-challenge-reward-${challenge.id}`}>
                    {challenge.reward} points
                  </span>
                </div>
                <span className="text-xs text-gray-500" data-testid={`text-challenge-days-${challenge.id}`}>
                  {challenge.daysLeft} days left
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" style={{ color: 'var(--savesmart-purple)' }} />
            Badge Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`border rounded-lg p-4 text-center transition-all ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
                data-testid={`badge-${badge.id}`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className={`font-semibold text-sm ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <p className={`text-xs mt-1 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                {badge.earned && (
                  <Badge className="mt-2 bg-yellow-500 text-white">Earned</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" style={{ color: 'var(--savesmart-blue)' }} />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboard.map((user) => (
            <div 
              key={user.rank} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
              data-testid={`leaderboard-${user.rank}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.rank === 1 ? 'bg-yellow-500 text-white' :
                  user.rank === 2 ? 'bg-gray-400 text-white' :
                  user.rank === 3 ? 'bg-orange-600 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {user.rank}
                </div>
                <span className="text-2xl">{user.avatar}</span>
                <span className={`font-medium ${user.isUser ? 'text-blue-700' : 'text-gray-900'}`}>
                  {user.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" style={{ color: 'var(--savesmart-purple)' }} />
                <span className="font-semibold" data-testid={`leaderboard-points-${user.rank}`}>
                  {user.points}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default Gamification