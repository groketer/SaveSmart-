import type { User, SavingsGoal, Activity, Badge, Challenge } from '@shared/schema'

// Local Storage utilities for SaveSmart app
export class LocalStorageManager {
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private getFromStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  // User operations
  createUser(user: Omit<User, 'id' | 'joinDate'>): User {
    const users = this.getFromStorage<User>('savesmart_users')
    const newUser: User = {
      ...user,
      id: this.generateId(),
      joinDate: new Date().toISOString()
    }
    users.push(newUser)
    this.saveToStorage('savesmart_users', users)
    return newUser
  }

  getUserByEmail(email: string): User | null {
    const users = this.getFromStorage<User>('savesmart_users')
    return users.find(user => user.email === email) || null
  }

  getCurrentUser(): User | null {
    const userId = localStorage.getItem('savesmart_current_user')
    if (!userId) return null
    
    const users = this.getFromStorage<User>('savesmart_users')
    return users.find(user => user.id === userId) || null
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem('savesmart_current_user', userId)
  }

  updateUser(id: string, updates: Partial<User>): User {
    const users = this.getFromStorage<User>('savesmart_users')
    const index = users.findIndex(user => user.id === id)
    if (index === -1) throw new Error('User not found')
    
    users[index] = { ...users[index], ...updates }
    this.saveToStorage('savesmart_users', users)
    return users[index]
  }

  // Savings goal operations
  createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>, userId: string): SavingsGoal {
    const goals = this.getFromStorage<SavingsGoal>('savesmart_goals')
    const newGoal: SavingsGoal = {
      ...goal,
      id: this.generateId(),
      userId,
      createdAt: new Date().toISOString()
    }
    goals.push(newGoal)
    this.saveToStorage('savesmart_goals', goals)
    return newGoal
  }

  getSavingsGoalsByUserId(userId: string): SavingsGoal[] {
    const goals = this.getFromStorage<SavingsGoal>('savesmart_goals')
    return goals.filter(goal => goal.userId === userId)
  }

  updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): SavingsGoal {
    const goals = this.getFromStorage<SavingsGoal>('savesmart_goals')
    const index = goals.findIndex(goal => goal.id === id)
    if (index === -1) throw new Error('Goal not found')
    
    goals[index] = { ...goals[index], ...updates }
    this.saveToStorage('savesmart_goals', goals)
    return goals[index]
  }

  deleteSavingsGoal(id: string): void {
    const goals = this.getFromStorage<SavingsGoal>('savesmart_goals')
    const filtered = goals.filter(goal => goal.id !== id)
    this.saveToStorage('savesmart_goals', filtered)
  }

  // Activity operations
  createActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const activities = this.getFromStorage<Activity>('savesmart_activities')
    const newActivity: Activity = {
      ...activity,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    }
    activities.push(newActivity)
    this.saveToStorage('savesmart_activities', activities)
    return newActivity
  }

  getActivitiesByUserId(userId: string): Activity[] {
    const activities = this.getFromStorage<Activity>('savesmart_activities')
    return activities
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  }

  // Gamification operations
  getDefaultBadges(): Badge[] {
    return [
      { id: 'first_savings', name: 'First Savings', description: 'Made your first savings deposit', earned: false, icon: '💰' },
      { id: 'streak_keeper', name: 'Streak Keeper', description: 'Saved money for 7 days in a row', earned: false, icon: '🔥' },
      { id: 'goal_crusher', name: 'Goal Crusher', description: 'Completed your first savings goal', earned: false, icon: '🎯' },
      { id: 'savings_champion', name: 'Savings Champion', description: 'Saved over $1000 total', earned: false, icon: '🏆' },
      { id: 'community_helper', name: 'Community Helper', description: 'Helped 5 friends with savings tips', earned: false, icon: '🤝' },
      { id: 'level_up', name: 'Level Up', description: 'Reached level 5', earned: false, icon: '⭐' }
    ]
  }

  getUserBadges(userId: string): Badge[] {
    const user = this.getCurrentUser()
    if (!user) return this.getDefaultBadges()

    const allBadges = this.getDefaultBadges()
    return allBadges.map(badge => ({
      ...badge,
      earned: user.badges.includes(badge.id)
    }))
  }

  getDefaultChallenges(): Challenge[] {
    return [
      {
        id: '1',
        title: 'Save $50 This Week',
        description: 'Add $50 to any of your savings goals',
        progress: 0,
        reward: 150,
        daysLeft: 7,
        difficulty: 'Easy'
      },
      {
        id: '2',
        title: 'Daily Saver',
        description: 'Save money every day for 7 days',
        progress: 0,
        reward: 200,
        daysLeft: 7,
        difficulty: 'Medium'
      },
      {
        id: '3',
        title: 'Goal Setter',
        description: 'Create 3 new savings goals',
        progress: 0,
        reward: 300,
        daysLeft: 14,
        difficulty: 'Hard'
      }
    ]
  }

  logout(): void {
    localStorage.removeItem('savesmart_current_user')
  }
}

export const storage = new LocalStorageManager()