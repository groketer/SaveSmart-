# SaveSmart: Gamified Savings App

A modern, gamified savings application that helps users build better financial habits through goal-setting, automated tracking, and reward systems.

## Features

- 🎯 **Savings Goals**: Set and track multiple savings goals with visual progress indicators
- 🎮 **Gamification**: Earn points, badges, and level up as you save
- 📊 **Dashboard**: Track your total savings, recent activity, and current challenges
- 🏆 **Challenges**: Complete weekly/monthly savings challenges for bonus points
- 👤 **Profile Management**: View your progress, badges, and customize settings
- 📱 **Mobile-First Design**: Responsive design optimized for all devices

## Technology Stack

- **Frontend**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Local Storage (no database required)
- **Build Tool**: Vite
- **UI Components**: Custom component library

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Building for Production

```bash
cd client && npm run build
```

The build output will be in the `client/dist` folder.

## Deployment on Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/savesmart-app.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the settings from `vercel.json`
   - Click "Deploy"

3. **Configure Build Settings (if needed):**
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 3: Manual Deployment

1. **Build the project:**
   ```bash
   cd client && npm run build
   ```

2. **Upload the `client/dist` folder to your hosting provider**

## Environment Variables

This app uses local storage only and doesn't require any environment variables or external services.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.