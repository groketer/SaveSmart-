import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit,
  Star,
  Trophy,
  Target,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react'
import type { User as UserType } from '@shared/schema'

interface ProfileProps {
  user: UserType
  onLogout: () => void
}

const Profile = ({ user, onLogout }: ProfileProps) => {
  const [notifications, setNotifications] = useState({
    savings: true,
    challenges: true,
    achievements: true,
    tips: false
  })

  const userStats = {
    totalSaved: user.totalSavings,
    goalsCompleted: 3,
    currentStreak: user.streak,
    joinDate: user.joinDate,
    totalPoints: user.points,
    level: user.level
  }

  const achievements = [
    { name: 'First Savings', icon: '💰', date: user.joinDate },
    { name: 'Streak Keeper', icon: '🔥', date: user.joinDate },
    { name: 'Goal Crusher', icon: '🎯', date: user.joinDate }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleAccountSettings = () => {
    alert('Account Settings - Coming Soon!')
  }

  const handlePrivacySecurity = () => {
    alert('Privacy & Security Settings - Coming Soon!')
  }

  const handleHelpSupport = () => {
    alert('Help & Support - Coming Soon!')
  }

  return (
    <div className="p-4 pb-20 space-y-6" data-testid="profile-page">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0" data-testid="button-edit-avatar">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-user-name">{user.name}</h1>
          <p className="text-gray-600" data-testid="text-user-email">{user.email}</p>
          <Badge 
            className="mt-2" 
            style={{ backgroundColor: 'var(--savesmart-purple)', color: 'white' }}
            data-testid="badge-user-level"
          >
            Level {user.level} • {user.points} points
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" style={{ color: 'var(--savesmart-blue)' }} />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--savesmart-blue)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--savesmart-blue)' }} data-testid="text-total-saved">
                ${userStats.totalSaved.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Saved</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--savesmart-green)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--savesmart-green)' }} data-testid="text-goals-completed">
                {userStats.goalsCompleted}
              </p>
              <p className="text-sm text-gray-600">Goals Completed</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--savesmart-orange)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--savesmart-orange)' }} data-testid="text-current-streak">
                {userStats.currentStreak}
              </p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--savesmart-purple)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--savesmart-purple)' }} data-testid="text-total-points">
                {userStats.totalPoints}
              </p>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600" data-testid="text-member-since">
            Member since {formatDate(userStats.joinDate)}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" style={{ color: 'var(--savesmart-purple)' }} />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg" data-testid={`achievement-${index}`}>
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <p className="font-semibold">{achievement.name}</p>
                <p className="text-sm text-gray-600">Earned on {formatDate(achievement.date)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" style={{ color: 'var(--savesmart-blue)' }} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Savings Reminders</p>
              <p className="text-sm text-gray-600">Get reminded to save money</p>
            </div>
            <Switch 
              checked={notifications.savings}
              onCheckedChange={() => handleNotificationChange('savings')}
              data-testid="switch-savings"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Challenge Updates</p>
              <p className="text-sm text-gray-600">New challenges and progress</p>
            </div>
            <Switch 
              checked={notifications.challenges}
              onCheckedChange={() => handleNotificationChange('challenges')}
              data-testid="switch-challenges"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Achievement Alerts</p>
              <p className="text-sm text-gray-600">When you earn badges</p>
            </div>
            <Switch 
              checked={notifications.achievements}
              onCheckedChange={() => handleNotificationChange('achievements')}
              data-testid="switch-achievements"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Financial Tips</p>
              <p className="text-sm text-gray-600">Weekly money-saving tips</p>
            </div>
            <Switch 
              checked={notifications.tips}
              onCheckedChange={() => handleNotificationChange('tips')}
              data-testid="switch-tips"
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Options */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleAccountSettings}
          data-testid="button-account-settings"
        >
          <Settings className="h-4 w-4 mr-3" />
          Account Settings
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handlePrivacySecurity}
          data-testid="button-privacy"
        >
          <Shield className="h-4 w-4 mr-3" />
          Privacy & Security
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleHelpSupport}
          data-testid="button-help"
        >
          <HelpCircle className="h-4 w-4 mr-3" />
          Help & Support
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
          onClick={onLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default Profile