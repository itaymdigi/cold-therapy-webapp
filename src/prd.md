# Wellness Tracker - Product Requirements Document

## Core Purpose & Success

**Mission Statement**: Empower users to build mental resilience and track their wellness journey through cold therapy and breathing practices in an intuitive, gamified experience.

**Success Indicators**: 
- User retention through consistent session logging across different wellness practices
- Progressive improvement in session duration for both ice baths and breathing exercises
- Achievement unlock rate and engagement across multiple wellness modalities
- Authentication completion rate
- Cross-modality usage (users engaging with both ice bath and breathing features)

**Experience Qualities**: 
- **Holistic** - Supporting multiple wellness practices in one unified experience
- **Motivational** - Inspiring users to push their limits across different practices
- **Modern** - Contemporary, polished interface with smooth interactions
- **Resilient** - Reflecting the mental strength being built through various techniques

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with user authentication and persistent state)

**Primary User Activity**: Creating and tracking - Users actively log sessions, review progress, and work toward achievements

## Essential Features

### User Authentication
- **Google Sign-In Integration**: Secure, frictionless authentication using Google OAuth
- **User Profile Management**: Display user information with avatar and name
- **Session Persistence**: All data tied to authenticated user account

### User Onboarding System
- **Welcome Flow**: Multi-step guided introduction to the wellness platform
- **Personal Information Collection**: Name, experience level, wellness goals
- **Interest Selection**: Cold therapy, breathing techniques, or both practices  
- **Goal Setting**: Stress relief, focus, recovery, energy, sleep, mindfulness
- **Duration Preferences**: Suggested session lengths based on user goals
- **Experience Customization**: Tailored recommendations based on beginner/intermediate/advanced level
- **Completion Tracking**: Persistent onboarding state to prevent re-showing
- **Profile Integration**: Seamless transition from onboarding to main application

### Advanced Session Types
- **Session Type Selection**: Choose from multiple thermal and breathing therapy options
  - **Ice Bath**: Traditional cold water immersion (10-15°C, 2-5 min default)
  - **Cold Plunge**: Intense cold therapy for advanced users (4-10°C, 1-3 min default)
  - **Sauna**: Dry heat therapy for relaxation (80-100°C, 15-30 min default)  
  - **Jacuzzi**: Warm water therapy for recovery (37-40°C, 20-40 min default)
  - **Contrast Therapy**: Alternating hot/cold for enhanced benefits (10-20 min default)
    - **Guided Protocols**: Three structured contrast therapy protocols with timed cycles
      - **Basic 3:1 Protocol**: Beginner-friendly (3min hot / 1min cold cycles, 8min total)
      - **Finnish Sauna Method**: Traditional Nordic approach (sauna + ice plunge, 15min total) 
      - **Performance Protocol**: Advanced athletic recovery (complex cycle patterns, 12min total)
    - **Phase Management**: Automatic transitions between hot and cold phases
    - **Protocol Selection**: Pre-configured cycles with temperature and timing guidance
    - **Progress Tracking**: Visual indicators for current phase and total session progress
    - **Audio Notifications**: Alerts for phase changes and completion
  - **Breathing Practice**: Various pranayama techniques (5-20 min default)
- **Temperature Tracking**: Record actual temperatures for thermal sessions
- **Intensity Levels**: Track session difficulty (Low/Medium/High)
- **Customizable Timers**: Each session type has appropriate preset durations
- **Session-Specific UI**: Icons, colors, and motivational messages tailored to each type
- **Enhanced Analytics**: Progress tracking across different modalities

### Session Timer
- **Large, Prominent Timer Display**: Central focus with circular progress indicator
- **Preset Duration Options**: Quick selection for common session lengths (1-10 minutes)
- **Real-time Progress Tracking**: Visual progress ring with gradient effects
- **Motivational Messaging**: Dynamic encouragement based on session progress
- **Voice Activation**: Hands-free timer control using speech recognition
  - Voice commands for start, pause, stop, and duration setting
  - Visual feedback for voice recognition status
  - Command guide for user reference
  - Cross-browser compatibility with fallback for unsupported browsers

### Breathing & Pranayama Sessions
- **Multiple Breathing Techniques**: Curated selection of proven methods
  - Box Breathing (4-4-4-4 pattern) for balance and focus
  - Wim Hof Method for energy and vitality  
  - 4-7-8 Breathing for relaxation and stress relief
  - Basic Pranayama for traditional yogic practice
  - Energizing Breath for alertness and metabolism boost
- **Guided Session Interface**: Visual breathing guide with animated timing
- **Pattern Customization**: Adjustable inhale/hold/exhale/hold ratios
- **Cycle Tracking**: Progress through predetermined cycles with completion feedback
- **Technique Benefits Display**: Educational information about each method's advantages

### Navigation System
- **Burger Menu Navigation**: Slide-out menu for easy access to all features
- **Session Type Switching**: Seamless transition between cold therapy and breathing practices
- **User Context Awareness**: Navigation reflects current user state and preferences
- **Responsive Design**: Optimized for mobile-first experience with touch-friendly interactions

### Session Logging & History  
- **Multi-Modal Session Records**: Track both ice bath and breathing sessions with type-specific metadata
- **Detailed Session Data**: Duration, timestamp, technique/method, mood, and personal notes
- **Visual Session History**: Card-based layout with progress indicators and type differentiation
- **Session Type Analytics**: Separate and combined statistics for different wellness practices
- **Mood Tracking**: Emotional state capture with intuitive emoji-based selection
- **Personal Best Tracking**: Highlight longest sessions and improvements across all modalities
- **Session Editing**: Ability to modify past sessions and add retrospective notes

### Gamification & Achievements
- **Multi-tier Achievement System**: Common, Rare, Epic, and Legendary achievements
- **Progress Tracking**: Visual progress bars for ongoing achievements  
- **Streak Tracking**: Daily consistency rewards
- **Category-based Goals**: Duration, frequency, consistency, and milestone achievements

## Design Direction

### Visual Tone & Identity
**Emotional Response**: The design should evoke feelings of strength, clarity, and determination while maintaining approachability and warmth.

**Design Personality**: Modern, premium, and inspiring - like a high-end fitness app that focuses on mental training rather than physical exercise.

**Visual Metaphors**: 
- Ice and snow elements (subtle, not overwhelming)
- Progress and growth indicators
- Achievement and trophy elements
- Clean, breathable spaces representing mental clarity

**Simplicity Spectrum**: Refined minimalism with purposeful moments of visual interest and celebration.

### Color Strategy
**Color Scheme Type**: Analogous with warm accent

**Primary Color**: Cool blue (#3B82F6) - representing ice, calm, and focus
**Secondary Colors**: Indigo (#6366F1) for depth and sophistication
**Accent Color**: Warm amber/orange (#F59E0B) for achievements, success states, and energy
**Color Psychology**: 
- Blues convey trust, calm, and mental clarity
- Warm accents create motivation and celebration
- Gradients add premium feel and visual interest

**Color Accessibility**: All combinations meet WCAG AA standards with 4.5:1+ contrast ratios

### Typography System
**Font Pairing Strategy**: Single typeface (Inter) with varied weights for hierarchy
**Typographic Hierarchy**: 
- Headlines: 700-900 weight for impact
- Body text: 400-500 weight for readability  
- UI elements: 500-600 weight for clarity

**Font Personality**: Inter conveys modern professionalism with excellent readability
**Typography Consistency**: Consistent scale using mathematical relationships

### Visual Hierarchy & Layout
**Attention Direction**: 
1. Timer (primary focus during sessions)
2. Current stats and achievements
3. Historical data and details

**White Space Philosophy**: Generous padding and margins create breathing room and focus
**Grid System**: Consistent 4px grid with responsive breakpoints
**Component Density**: Balanced information density - detailed when needed, simplified for primary actions

### Animations & Micro-interactions
**Purposeful Motion**:
- Timer animations reinforce progress and passage of time
- Achievement unlocks create moments of celebration
- Smooth transitions maintain spatial relationships
- Loading states with personality (spinning snowflakes)

**Natural Physics**: Ease-out transitions, subtle spring animations for button interactions

### UI Components & Customization
**Component Usage**:
- Cards for session history and achievements
- Progress rings and bars for tracking
- Badges for moods and achievement status
- Gradients for premium feel and visual hierarchy

**Component States**: All interactive elements have clear hover, active, and focus states
**Mobile Adaptation**: Touch-friendly sizing (44px minimum) with optimized layouts

## Implementation Considerations

### Technical Features
- **Real-time Timer**: Accurate countdown with progress visualization
- **Data Persistence**: User sessions and preferences stored securely
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Performance**: Smooth animations and transitions

### Authentication Flow
- **OAuth Integration**: Seamless Google sign-in with user data fetching
- **Session Management**: Persistent authentication state
- **User Context**: Profile information displayed throughout the app

### Data Structure
- **Session Schema**: ID, duration, timestamp, mood, notes
- **Achievement Schema**: ID, title, description, unlock criteria, progress
- **User Schema**: Authentication details and preferences

## Edge Cases & Problem Scenarios

**Timer Interruptions**: Handle browser/app backgrounding and restoration
**Data Loss Prevention**: Automatic session saving with confirmation dialogs
**Network Issues**: Offline capability with sync when reconnected
**Achievement Edge Cases**: Handle simultaneous unlocks and progress calculations

## Success Metrics

**Engagement**: Daily/weekly active users, session completion rate
**Progression**: Average session duration improvement over time
**Retention**: User return rate, streak maintenance
**Achievement**: Unlock rate and progression through tiers

## Future Enhancements

**AI Features**: Personalized encouragement, optimal session recommendations
**Social Features**: Friend challenges, leaderboards
**Advanced Analytics**: Progress trends, correlation insights
**Wearable Integration**: Heart rate monitoring, automatic session detection