import { useState, useEffect } from 'react'
import { Router, Route, Switch } from 'wouter'
import { storage } from './lib/localStorage'
import type { User } from '@shared/schema'

// Import pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SavingsGoals from './pages/SavingsGoals'
import Gamification from './pages/Gamification'
import Profile from './pages/Profile'
import Navigation from './components/Navigation'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = storage.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    storage.setCurrentUser(userData.id)
  }

  const handleLogout = () => {
    setUser(null)
    storage.logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Switch>
            <Route path="/register">
              <Register onLogin={handleLogin} />
            </Route>
            <Route>
              <Login onLogin={handleLogin} />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
          <Switch>
            <Route path="/">
              <Dashboard user={user} />
            </Route>
            <Route path="/goals">
              <SavingsGoals user={user} />
            </Route>
            <Route path="/gamification">
              <Gamification user={user} />
            </Route>
            <Route path="/profile">
              <Profile user={user} onLogout={handleLogout} />
            </Route>
          </Switch>
          <Navigation />
        </div>
      </div>
    </Router>
  )
}

export default App