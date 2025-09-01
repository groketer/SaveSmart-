import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  PiggyBank, 
  Target, 
  TrendingUp, 
  Plus, 
  Star, 
  Trophy,
  Zap,
  DollarSign
} from 'lucide-react'
import { storage } from '@/lib/localStorage'
import type { User, SavingsGoal, Activity, Challenge } from '@shared/schema'
import { Link } from 'wouter'

interface DashboardProps {
  user: User
}

const Dashboard = ({ user }: DashboardProps) => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)

  useEffect(() => {
    const goals = storage.getSavingsGoalsByUserId(user.id)
    const activities = storage.getActivitiesByUserId(user.id)
    const challenges = storage.getDefaultChallenges()
    
    setSavingsGoals(goals)
    setRecentActivity(activities)
    setCurrentChallenge(challenges[0] || null)
  }, [user.id])

  const handleAddMoney = (amount: number) => {
    // Add money to the first goal if available
    if (savingsGoals.length > 0) {
      const goal = savingsGoals[0]
      const updatedGoal = storage.updateSavingsGoal(goal.id, {
        current: Math.min(goal.current + amount, goal.target)
      })
      
      // Update user total savings
      storage.updateUser(user.id, {
        totalSavings: user.totalSavings + amount,
        points: user.points + Math.floor(amount / 10) // 1 point per $10
      })
      
      // Create activity
      storage.createActivity({
        userId: user.id,
        type: 'savings',
        amount,
        description: `Added $${amount} to ${goal.name}`
      })
      
      // Refresh data
      const goals = storage.getSavingsGoalsByUserId(user.id)
      const activities = storage.getActivitiesByUserId(user.id)
      setSavingsGoals(goals)
      setRecentActivity(activities)
    }
  }

  return (
    <div className="p-4 pb-20 space-y-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-greeting">
            Hi, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Ready to save smart today?</p>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="flex items-center space-x-1 px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: 'var(--savesmart-purple)' }}
            data-testid="text-points"
          >
            <Star className="h-4 w-4" />
            <span className="font-semibold">{user.points}</span>
          </div>
        </div>
      </div>

      {/* Total Savings Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-90"></div>
        <CardContent className="relative p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Savings</p>
              <p className="text-3xl font-bold" data-testid="text-total-savings">
                ${user.totalSavings.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Keep it up!</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <PiggyBank className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-16 flex-col space-y-1" 
          variant="outline"
          onClick={() => handleAddMoney(25)}
          data-testid="button-add-money"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">Add $25</span>
        </Button>
        <Link to="/goals">
          <Button className="h-16 flex-col space-y-1 w-full" variant="outline" data-testid="button-new-goal">
            <Target className="h-5 w-5" />
            <span className="text-sm">New Goal</span>
          </Button>
        </Link>
      </div>

      {/* Current Challenge */}
      {currentChallenge && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2" style={{ color: 'var(--savesmart-purple)' }} />
                Current Challenge
              </CardTitle>
              <Badge variant="secondary" data-testid="text-challenge-days">
                {currentChallenge.daysLeft} days left
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span data-testid="text-challenge-name">{currentChallenge.title}</span>
                <span data-testid="text-challenge-progress">{currentChallenge.progress}%</span>
              </div>
              <Progress value={currentChallenge.progress} className="h-2" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Reward:</span>
              <div className="flex items-center" style={{ color: 'var(--savesmart-purple)' }}>
                <Star className="h-4 w-4 mr-1" />
                <span className="font-semibold" data-testid="text-challenge-reward">
                  {currentChallenge.reward} points
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Savings Goals Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Savings Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savingsGoals.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">No savings goals yet</p>
              <Link to="/goals">
                <Button 
                  className="text-white" 
                  style={{ backgroundColor: 'var(--savesmart-blue)' }}
                  data-testid="button-create-first-goal"
                >
                  Create Your First Goal
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {savingsGoals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="space-y-2" data-testid={`goal-preview-${goal.id}`}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-gray-600">${goal.current} / ${goal.target}</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </div>
              ))}
              <Link to="/goals">
                <Button 
                  variant="ghost" 
                  className="w-full text-sm" 
                  style={{ color: 'var(--savesmart-blue)' }}
                  data-testid="button-view-all-goals"
                >
                  View All Goals
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No activity yet</p>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center space-x-3" data-testid={`activity-${index}`}>
                <div className={`p-2 rounded-full ${activity.type === 'savings' ? 'bg-green-100' : 'bg-purple-100'}`}>
                  {activity.type === 'savings' ? (
                    <DollarSign className="h-4 w-4" style={{ color: 'var(--savesmart-green)' }} />
                  ) : (
                    <Trophy className="h-4 w-4" style={{ color: 'var(--savesmart-purple)' }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.type === 'savings' && activity.amount && `+$${activity.amount} `}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard