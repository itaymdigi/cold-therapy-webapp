# Ice Bath Plunge Tracker - Product Requirements Document

Transform your ice bath sessions into an engaging, motivating journey with gamified tracking and comprehensive analytics.

**Experience Qualities**:
1. **Empowering** - Users feel accomplished and motivated after each session with clear progress visualization
2. **Focused** - Clean, distraction-free interface during sessions with prominent timer display
3. **Encouraging** - Positive reinforcement through achievements, streaks, and progress milestones

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected features (timer, logging, gamification) with persistent user data and session history

## Essential Features

### Big Session Timer
- **Functionality**: Large, prominent countdown timer for ice bath sessions with start/pause/stop controls
- **Purpose**: Core tracking mechanism that provides clear visual feedback during intense cold exposure
- **Trigger**: User taps "Start Session" button from main dashboard
- **Progression**: Set duration → Start timer → Large display with pause/resume → Complete session → Auto-save to history
- **Success criteria**: Timer remains visible and functional throughout session, accurately tracks time, saves data automatically

### User Authentication & Profiles
- **Functionality**: GitHub-based sign-in with personalized user profiles and data persistence
- **Purpose**: Enables personal progress tracking and secure data storage across devices
- **Trigger**: User opens app without existing session or manually signs in
- **Progression**: Landing screen → Sign in with GitHub → Profile creation → Access to personal dashboard
- **Success criteria**: Seamless authentication flow, persistent login state, personal data isolation

### Session Logging & History
- **Functionality**: Automatic session recording with duration, date, and optional notes/mood tracking
- **Purpose**: Provides historical context and progress visualization over time
- **Trigger**: Automatic logging after each completed session or manual entry
- **Progression**: Complete session → Auto-save with timestamp → View in history tab → Add optional notes → Export data
- **Success criteria**: All sessions saved reliably, searchable history, data export capability

### Gamification System
- **Functionality**: Achievement badges, streak counters, progress levels, and milestone celebrations
- **Purpose**: Maintains motivation through challenging periods and celebrates consistency
- **Trigger**: Achievements unlock automatically based on session data and patterns
- **Progression**: Complete sessions → Earn points/badges → Level progression → Unlock new challenges → Share achievements
- **Success criteria**: Engaging progression system, meaningful rewards, social sharing options

### Progress Analytics
- **Functionality**: Visual charts showing duration trends, frequency patterns, and personal records
- **Purpose**: Data-driven insights to optimize training and track improvement over time
- **Trigger**: User navigates to analytics/stats section
- **Progression**: View dashboard → Select time range → Analyze trends → Set new goals → Track progress
- **Success criteria**: Clear visualizations, multiple time ranges, exportable insights

## Edge Case Handling
- **Timer interruption**: Auto-pause when app backgrounded, resume on return with notification
- **Network connectivity**: Offline session recording with sync when connection restored  
- **Incomplete sessions**: Save partial sessions as drafts, allow completion later
- **Data corruption**: Local backup with recovery options and export functionality
- **Battery drain**: Optimize timer display, screen dimming options during sessions

## Design Direction
The design should feel motivating yet calming, like a premium fitness app that respects the intensity of cold exposure - clean interfaces with bold, readable typography and subtle animations that celebrate progress without distraction.

## Color Selection
Triadic (three equally spaced colors) - Using cool blues representing ice/water, warm orange for motivation/achievement, and clean neutrals for focus and readability.

- **Primary Color**: Deep Ice Blue (oklch(0.45 0.15 240)) - Represents cold, focus, and determination
- **Secondary Colors**: 
  - Neutral Gray (oklch(0.75 0.02 240)) for backgrounds and secondary UI elements
  - Deep Charcoal (oklch(0.25 0.02 240)) for text and strong contrasts
- **Accent Color**: Energetic Orange (oklch(0.72 0.18 45)) - Achievement highlights, CTAs, and motivation elements
- **Foreground/Background Pairings**:
  - Background White (oklch(0.98 0.005 240)): Deep Charcoal text (oklch(0.25 0.02 240)) - Ratio 12.1:1 ✓
  - Primary Ice Blue (oklch(0.45 0.15 240)): White text (oklch(0.98 0.005 240)) - Ratio 7.8:1 ✓
  - Accent Orange (oklch(0.72 0.18 45)): Deep Charcoal text (oklch(0.25 0.02 240)) - Ratio 5.2:1 ✓
  - Neutral Gray (oklch(0.75 0.02 240)): Deep Charcoal text (oklch(0.25 0.02 240)) - Ratio 4.7:1 ✓

## Font Selection
Typography should convey strength and clarity with excellent readability during intense sessions - using Inter for its technical precision and excellent mobile legibility.

- **Typographic Hierarchy**:
  - H1 (Timer Display): Inter Bold/48px/tight spacing for maximum session visibility
  - H2 (Section Headers): Inter Semibold/24px/normal spacing for clear navigation
  - H3 (Card Titles): Inter Medium/18px/normal spacing for content organization
  - Body (General Text): Inter Regular/16px/relaxed spacing for comfortable reading
  - Caption (Metadata): Inter Regular/14px/normal spacing for supplementary information

## Animations
Subtle and purposeful animations that enhance focus rather than distract - smooth state transitions and gentle celebrations that acknowledge achievements without disrupting the meditative nature of cold exposure.

- **Purposeful Meaning**: Smooth timer transitions reinforce the flow state, achievement animations provide positive reinforcement, and navigation transitions maintain spatial awareness
- **Hierarchy of Movement**: Timer state changes receive priority, followed by achievement celebrations, then general UI transitions

## Component Selection
- **Components**: 
  - Card components for session history and stats display
  - Button variants for timer controls (primary for start/stop, secondary for pause)
  - Progress components for streaks and level progression
  - Dialog components for session completion and achievements
  - Tabs for main navigation between timer, history, and stats
  - Avatar components for user profile display
- **Customizations**: 
  - Large circular timer display component with custom progress ring
  - Achievement badge components with animated reveal states
  - Session card components with duration and mood indicators
- **States**: 
  - Timer buttons: Distinct visual states for start (green), pause (yellow), stop (red)
  - Achievement cards: Locked, unlocked, and newly-earned animation states
  - Session cards: Complete, in-progress, and draft visual indicators
- **Icon Selection**: 
  - Timer/stopwatch icons for session controls
  - Flame icons for streaks and achievements  
  - Trophy icons for milestones and personal records
  - Thermometer icons for cold/ice theme elements
- **Spacing**: Consistent 16px base unit with 8px, 16px, 24px, and 32px spacing scale
- **Mobile**: Mobile-first design with large touch targets (minimum 44px), swipe gestures for navigation, and full-screen timer mode for sessions