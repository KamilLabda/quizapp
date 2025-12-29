# Punkcikowo

A professional survey platform where users complete surveys and earn rewards. Built with Next.js 16, MongoDB, and modern web technologies.

## Features

- ✅ User authentication (register, login, logout)
- ✅ Survey system with multiple survey types
- ✅ Points system for completed surveys
- ✅ Daily limits (reset at midnight)
- ✅ Video reward ads (1 point each, max 5 per day)
- ✅ Guest mode - complete surveys without login, login required after first survey
- ✅ Guest data migration - guest completions transfer to account on login
- ✅ Ad system with rotation (dummy placeholders - easy to replace)
- ✅ Offerwall integration for external surveys
- ✅ User data tracking (IP, session time, user agent, referrer)
- ✅ Responsive UI with shadcn/ui
- ✅ MongoDB database integration

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, shadcn/ui, Tailwind CSS
- **Authentication**: JWT with httpOnly cookies
- **Database**: MongoDB (native driver)
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables in `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/quizapp
   JWT_SECRET=your-secret-key-here
   ```

4. Start MongoDB (if using local):
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── surveys/      # Survey endpoints
│   │   ├── guest/        # Guest data migration
│   │   └── video-ads/    # Video ad endpoints
│   ├── survey/           # Survey pages
│   ├── surveys/          # Surveys listing page
│   ├── login/            # Login page
│   └── register/         # Register page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── survey/           # Survey components
│   ├── ads/              # Ad components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── db/               # Database layer (MongoDB)
│   ├── auth.ts           # Authentication utilities
│   ├── points.ts         # Points system
│   ├── ads.ts            # Ad system
│   └── guest-session.ts  # Guest session management
└── types/                 # TypeScript types
```

## Database

The project uses MongoDB for all data storage. Collections include:
- `users` - User accounts
- `surveys` - Survey definitions
- `usersurveycompletions` - Survey completion records
- `dailylimits` - Daily limit tracking
- `adconfigs` - Ad configuration
- `linkshorteners` - Link shortener configs
- `analyticsevents` - Analytics events
- `videoadrewards` - Video ad reward tracking

## Guest Mode

Users can complete surveys without logging in. Their progress is saved in localStorage. After completing the first survey, users are prompted to log in. Upon login/registration, all guest data is automatically migrated to their account.

## User Data Tracking

For each survey completion, the system tracks:
- IP Address
- Session Time
- User Agent
- Referrer

This data helps companies remember users and provide better offers.

## Replacing Dummy Ads

The ad system uses dummy placeholders. To replace with real ads:

1. Update `src/lib/ads.ts`:
   - Replace dummy ad codes with real ad network codes
   - Implement API calls to fetch ads dynamically

2. Update ad configs in MongoDB:
   - Add real ad network codes via admin panel or directly in database

## License

Private project
