import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Target, 
  DollarSign,
  Plane,
  Home,
  Laptop,
  Car,
  Umbrella
} from 'lucide-react'
import { storage } from '@/lib/localStorage'
import type { User, SavingsGoal } from '@shared/schema'

interface SavingsGoalsProps {
  user: User
}

const iconMap = {
  'Umbrella': Umbrella,
  'Plane': Plane,
  'Laptop': Laptop,
  'Car': Car,
  'Home': Home,
  'Target': Target
}

const SavingsGoals = ({ user }: SavingsGoalsProps) => {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    dueDate: ''
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadGoals()
  }, [user.id])

  const loadGoals = () => {
    const userGoals = storage.getSavingsGoalsByUserId(user.id)
    setGoals(userGoals)
  }

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.dueDate) {
      storage.createSavingsGoal({
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: 0,
        dueDate: newGoal.dueDate,
        icon: 'Target',
        color: 'bg-indigo-500'
      }, user.id)
      
      setNewGoal({ name: '', target: '', dueDate: '' })
      setIsDialogOpen(false)
      loadGoals()
      
      // Add activity
      storage.createActivity({
        userId: user.id,
        type: 'achievement',
        description: `Created new goal: ${newGoal.name}`
      })
    }
  }

  const handleAddMoney = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    
    const newAmount = Math.min(goal.current + amount, goal.target)
    storage.updateSavingsGoal(goalId, { current: newAmount })
    
    // Update user total savings and points
    storage.updateUser(user.id, {
      totalSavings: user.totalSavings + amount,
      points: user.points + Math.floor(amount / 10)
    })
    
    // Add activity
    storage.createActivity({
      userId: user.id,
      type: 'savings',
      amount,
      description: `Added $${amount} to ${goal.name}`
    })
    
    loadGoals()
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-4 pb-20 space-y-6" data-testid="savings-goals-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600">Track your progress towards financial freedom</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button 
              className="text-white" 
              style={{ backgroundColor: 'var(--savesmart-blue)' }}
              data-testid="button-add-goal"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-new-goal">
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Goal name (e.g., Dream Vacation)"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                data-testid="input-goal-name"
              />
              <Input
                type="number"
                placeholder="Target amount ($)"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                data-testid="input-goal-target"
              />
              <Input
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                data-testid="input-goal-date"
              />
              <Button 
                onClick={handleAddGoal} 
                className="w-full text-white" 
                style={{ backgroundColor: 'var(--savesmart-blue)' }}
                data-testid="button-create-goal"
              >
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
            <p className="text-gray-600 mb-4">Create your first savings goal to get started!</p>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const daysRemaining = getDaysRemaining(goal.dueDate)
            const IconComponent = iconMap[goal.icon as keyof typeof iconMap] || Target

            return (
              <Card key={goal.id} className="overflow-hidden" data-testid={`goal-card-${goal.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${goal.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" data-testid={`text-goal-name-${goal.id}`}>
                          {goal.name}
                        </h3>
                        <p className="text-gray-600 text-sm" data-testid={`text-goal-progress-${goal.id}`}>
                          ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={daysRemaining > 30 ? "secondary" : daysRemaining > 0 ? "destructive" : "default"}
                        data-testid={`badge-days-${goal.id}`}
                      >
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-semibold" data-testid={`text-percentage-${goal.id}`}>
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAddMoney(goal.id, 25)}
                        className="flex-1"
                        data-testid={`button-add-25-${goal.id}`}
                      >
                        +$25
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAddMoney(goal.id, 50)}
                        className="flex-1"
                        data-testid={`button-add-50-${goal.id}`}
                      >
                        +$50
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAddMoney(goal.id, 100)}
                        className="flex-1"
                        data-testid={`button-add-100-${goal.id}`}
                      >
                        +$100
                      </Button>
                    </div>

                    {progress >= 100 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center" data-testid={`goal-completed-${goal.id}`}>
                        <p className="text-green-800 font-semibold">🎉 Goal Completed!</p>
                        <p className="text-green-600 text-sm">Congratulations on reaching your target!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Summary Stats */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p 
                  className="text-2xl font-bold" 
                  style={{ color: 'var(--savesmart-blue)' }}
                  data-testid="text-active-goals"
                >
                  {goals.length}
                </p>
                <p className="text-sm text-gray-600">Active Goals</p>
              </div>
              <div className="text-center">
                <p 
                  className="text-2xl font-bold" 
                  style={{ color: 'var(--savesmart-green)' }}
                  data-testid="text-total-saved"
                >
                  ${goals.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SavingsGoals