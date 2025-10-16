# Convex Database Setup

## ✅ Status: Connected & Configured

Your Cold Therapy app is now connected to **Convex** - a real-time database with automatic sync.

---

## What is Convex?

Convex is a backend-as-a-service that provides:
- ✅ **Real-time sync** across all devices
- ✅ **Automatic caching** for instant UI updates
- ✅ **Type-safe** database queries
- ✅ **Serverless** - no infrastructure to manage
- ✅ **Offline-first** with automatic conflict resolution

---

## Project Structure

```
convex/
├── schema.ts          # Database schema (tables & types)
├── users.ts           # User authentication functions
├── sessions.ts        # Session CRUD operations
├── preferences.ts     # User preferences
├── settings.ts        # App settings (language, theme)
└── _generated/        # Auto-generated TypeScript types (gitignored)

src/
├── providers/
│   └── ConvexProvider.tsx  # Convex React provider
└── hooks/
    └── useConvexStorage.ts # Custom hooks for Convex data
```

---

## Database Schema

### **Tables**

#### 1. **users**
```typescript
{
  id: string,
  name: string,
  email: string,
  picture: string,
  signedInAt: string
}
```

#### 2. **sessions**
```typescript
{
  userId: string,
  duration: number,
  completedAt: string,
  type: 'ice-bath' | 'breathing' | 'sauna' | 'jacuzzi' | 'cold-plunge' | 'contrast-therapy',
  technique?: string,
  temperature?: number,
  mood?: string,
  notes?: string,
  intensity?: 'low' | 'medium' | 'high'
}
```

#### 3. **userPreferences**
```typescript
{
  userId: string,
  name: string,
  experience: 'beginner' | 'intermediate' | 'advanced',
  goals: string[],
  preferredDuration: number,
  interests: ('cold-therapy' | 'breathing')[],
  onboardingCompleted: boolean
}
```

#### 4. **appSettings**
```typescript
{
  userId: string,
  language: 'en' | 'he',
  theme?: 'light' | 'dark'
}
```

---

## Available Functions

### **Users** (`convex/users.ts`)
- `getOrCreateUser` - Create or get existing user
- `getUser` - Get user by ID

### **Sessions** (`convex/sessions.ts`)
- `createSession` - Save a new wellness session
- `getUserSessions` - Get all sessions for a user
- `updateSession` - Update session details
- `deleteSession` - Delete a session

### **Preferences** (`convex/preferences.ts`)
- `savePreferences` - Save/update user preferences
- `getPreferences` - Get user preferences

### **Settings** (`convex/settings.ts`)
- `saveSettings` - Save/update app settings
- `getSettings` - Get app settings

---

## Usage in Components

### **Example: Using Sessions**

```typescript
import { useConvexSessions } from '@/hooks/useConvexStorage'

function MyComponent() {
  const { sessions, createSession, deleteSession } = useConvexSessions()

  const handleComplete = async (duration: number) => {
    await createSession({
      duration,
      completedAt: new Date().toISOString(),
      type: 'ice-bath',
    })
  }

  return (
    <div>
      {sessions.map(session => (
        <div key={session._id}>
          {session.duration}s - {session.type}
        </div>
      ))}
    </div>
  )
}
```

### **Example: Using Preferences**

```typescript
import { useConvexPreferences } from '@/hooks/useConvexStorage'

function Onboarding() {
  const { preferences, savePreferences } = useConvexPreferences()

  const handleComplete = async (prefs) => {
    await savePreferences({
      ...prefs,
      onboardingCompleted: true
    })
  }
}
```

---

## Development

### **Start Development Server**
```bash
npm run dev
```
This will:
1. Start Convex dev server (watches for schema changes)
2. Start Vite dev server (React app)

### **View Database Dashboard**
Visit: https://dashboard.convex.dev/d/quiet-wildebeest-702

### **Deploy to Production**
```bash
npm run convex:deploy
```

---

## Environment Variables

Your `.env.local` file contains:
```env
CONVEX_DEPLOYMENT=dev:quiet-wildebeest-702
VITE_CONVEX_URL=https://quiet-wildebeest-702.convex.cloud
```

**⚠️ Important:** Never commit `.env.local` to git (already in .gitignore)

---

## Migration from localStorage

### **Before (localStorage)**
```typescript
import { useKV } from '@/hooks/useLocalStorage'

const [sessions, setSessions] = useKV('sessions', [])
```

### **After (Convex)**
```typescript
import { useConvexSessions } from '@/hooks/useConvexStorage'

const { sessions, createSession } = useConvexSessions()
```

### **Benefits**
- ✅ Data syncs across devices automatically
- ✅ Real-time updates (see changes instantly)
- ✅ Type-safe queries (no runtime errors)
- ✅ Automatic conflict resolution
- ✅ Query optimization (no over-fetching)

---

## Next Steps

### **1. Update Components**
Replace `useKV` hooks with Convex hooks in:
- [ ] `App.tsx` - sessions and preferences
- [ ] `LanguageContext.tsx` - app settings
- [ ] `Auth.tsx` - user authentication

### **2. Test Real-time Sync**
1. Open app in two browser tabs
2. Create a session in one tab
3. Watch it appear instantly in the other tab

### **3. Deploy to Production**
```bash
# Deploy Convex backend
npm run convex:deploy

# Deploy frontend to Vercel
vercel deploy
```

---

## Troubleshooting

### **TypeScript Errors**
If you see type errors in `convex/` files, run:
```bash
npx convex dev
```
This generates TypeScript types in `convex/_generated/`

### **Connection Issues**
Check that `VITE_CONVEX_URL` is set in `.env.local`

### **Data Not Syncing**
1. Ensure ConvexProvider wraps your app in `main.tsx`
2. Check browser console for errors
3. Verify userId is set correctly

---

## Resources

- 📚 [Convex Documentation](https://docs.convex.dev)
- 🎥 [Convex Video Tutorials](https://www.convex.dev/learn)
- 💬 [Convex Discord Community](https://convex.dev/community)
- 📧 Support: support@convex.dev

---

## Dashboard Access

**Project:** cold-therapy-webapp  
**Deployment:** quiet-wildebeest-702  
**Dashboard:** https://dashboard.convex.dev/t/itay-8b9c9/cold-therapy-webapp

From the dashboard you can:
- View all database tables
- Run queries manually
- Monitor function performance
- View logs and errors
- Manage deployments

---

**Last Updated:** October 16, 2025  
**Status:** ✅ Connected & Ready
