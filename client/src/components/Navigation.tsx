import { useLocation, Link } from 'wouter'
import { Home, Target, Trophy, User } from 'lucide-react'

const Navigation = () => {
  const [location] = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/gamification', icon: Trophy, label: 'Rewards' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200" data-testid="navigation-bar">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={isActive ? { backgroundColor: 'var(--savesmart-blue)' } : {}}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Navigation