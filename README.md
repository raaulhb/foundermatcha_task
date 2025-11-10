# Meeting Scheduler Platform

A full-stack meeting scheduling platform where users can browse other users, send meeting invitations, and automatically create scheduled meetings upon acceptance. Built with React, Firebase, and Tailwind CSS.

## 🎥 Demo

The application allows users to:

- Browse all registered users
- Send meeting invitations with proposed date/time
- Receive and respond to invitations in real-time
- View all scheduled meetings (upcoming and past)
- Automatic meeting creation upon invitation acceptance

## 🚀 Technologies Used

### Frontend

- **React 18** - UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3** - Utility-first styling
- **React Router DOM** - Client-side routing

### Backend

- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database with real-time updates
- **Firebase Emulator Suite** - Local development environment

### Development Tools

- **Node.js 18+** - JavaScript runtime
- **Firebase Tools** - CLI for Firebase services
- **Git** - Version control

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **Java 11+** installed (required for Firebase Emulators)
  - macOS: `brew install openjdk@11`
  - Linux: `sudo apt install openjdk-11-jdk`
  - Windows: [Download from Adoptium](https://adoptium.net/)
- **npm** or **yarn** package manager
- **Git** for cloning the repository

## 🔧 Local Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd meeting-scheduler
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Start Firebase Emulators

Open a terminal and run:

```bash
npm run emulators
```

**Expected Output:**

```
✔  All emulators ready!
┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
└────────────────┴────────────────┴─────────────────────────────────┘
```

**Important:** Keep this terminal window open!

### Step 4: Seed Test Data (Optional but Recommended)

Open a **new terminal** and run:

```bash
npm run seed
```

This creates 5 test users:

- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)
- Charlie Davis (charlie@example.com)
- Diana Martinez (diana@example.com)
- Eve Wilson (eve@example.com)

**All passwords:** `password123`

### Step 5: Start Frontend Development Server

Open another **new terminal** and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**

```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 6: Access the Application

Open your browser and navigate to: **http://localhost:5173**

## 🧪 Testing Instructions

### Test Scenario 1: Complete User Flow

1. **Register a new user:**

   - Click "Sign up"
   - Fill in all fields
   - Submit to create account

2. **Or login with test user:**

   - Email: `alice@example.com`
   - Password: `password123`

3. **Browse users:**

   - View all registered users on Dashboard
   - See avatar, name, and bio

4. **Send meeting invitation:**

   - Click "Send Meeting Invite" on any user
   - Fill in meeting details (title, description, date, time)
   - Submit invitation

5. **Accept invitation (different user):**

   - Logout from Alice
   - Login as `bob@example.com` / `password123`
   - Navigate to "Invitations"
   - Click "Accept" on received invitation

6. **View scheduled meeting:**
   - Navigate to "Meetings"
   - See the scheduled meeting in "Upcoming Meetings"
   - Logout and login as Alice
   - Alice should also see the meeting

### Test Scenario 2: Rejection Flow

1. Login as any user
2. Send invitation to another user
3. Login as the recipient
4. Go to "Invitations"
5. Click "Reject"
6. Invitation status changes to "Rejected"
7. No meeting is created

### Test Scenario 3: Real-time Updates

1. Open two browser windows (or use incognito mode)
2. Login as Alice in Window 1
3. Login as Bob in Window 2
4. Send invitation from Alice to Bob (Window 1)
5. Observe: Invitation appears immediately in Bob's inbox (Window 2)
6. Accept invitation in Window 2
7. Observe: Meeting appears immediately in both users' Meetings pages

## 🏗️ Architecture & Design Decisions

### Data Model

#### Users Collection

```javascript
{
  id: string,              // User UID from Firebase Auth
  email: string,
  displayName: string,
  bio: string,
  avatar: string,          // Auto-generated avatar URL
  createdAt: Timestamp
}
```

#### Invitations Collection

```javascript
{
  id: string,
  senderId: string,        // User UID of sender
  senderName: string,      // Denormalized for display
  senderAvatar: string,
  receiverId: string,      // User UID of receiver
  receiverName: string,
  receiverAvatar: string,
  title: string,
  description: string,
  proposedTime: Timestamp,
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Meetings Collection

```javascript
{
  id: string,
  title: string,
  description: string,
  participants: string[],      // Array of user UIDs
  participantNames: string[],  // Denormalized for display
  startTime: Timestamp,
  endTime: Timestamp,          // Auto-calculated (start + 1 hour)
  createdFrom: string,         // Reference to invitation ID
  status: 'scheduled',
  createdAt: Timestamp
}
```

### Key Architectural Decisions

1. **Firebase Emulator Suite**

   - Enables 100% local development
   - No cloud costs during development
   - Data persists between restarts (exported to `emulator-data/`)
   - Easy to reset and seed fresh data

2. **Real-time Listeners (onSnapshot)**

   - Used for invitations and meetings
   - Provides instant updates across all clients
   - Better UX than polling
   - Automatically handles connection issues

3. **Denormalized Data**

   - Store sender/receiver names and avatars in invitations
   - Store participant names in meetings
   - Trade-off: Slightly more storage for much faster reads
   - No need for JOINs (which Firestore doesn't support well)

4. **Context API for Authentication**

   - Global auth state accessible throughout app
   - Automatic user profile loading
   - Clean separation of concerns

5. **Firestore Security Rules**

   - Users can only edit their own profiles
   - Invitations visible only to sender and receiver
   - Meetings visible only to participants
   - Prevents unauthorized data access

6. **Component Structure**
   - Pages: Full page components with data fetching
   - Components: Reusable UI components (Navbar, UserCard, etc.)
   - Contexts: Global state management
   - Services/Config: Firebase initialization

### Tech Stack Rationale

- **React + Vite**: Fast development, hot module replacement, modern tooling
- **Tailwind CSS**: Rapid UI development, consistent design, small bundle size
- **Firebase**: Managed backend, real-time capabilities, easy authentication
- **Firestore**: NoSQL flexibility, real-time sync, offline support

## 📁 Project Structure

```
meeting-scheduler/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── UserCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InvitePage.jsx
│   │   │   ├── Invitations.jsx
│   │   │   └── Meetings.jsx
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── config/             # Configuration
│   │   │   └── firebase.js
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── scripts/                     # Utility scripts
│   └── seed-data.js            # Database seeding
├── firebase.json               # Firebase config
├── firestore.rules             # Security rules
├── firestore.indexes.json      # Database indexes
├── .firebaserc                 # Firebase project config
├── package.json                # Root dependencies
└── README.md                   # This file
```

## 🔐 Security Considerations

### Firestore Security Rules

All data access is controlled by Firestore security rules:

- **Authentication Required**: All operations require user to be logged in
- **User Profiles**: Users can only modify their own profile
- **Invitations**: Only sender and receiver can view invitations
- **Meetings**: Only participants can access meeting details

### Authentication

- Email/password authentication via Firebase Auth
- Passwords hashed and managed by Firebase (never stored in plain text)
- Auth state persisted across browser sessions
- Protected routes redirect unauthenticated users to login

## 🐛 Known Limitations & Future Improvements

### Current Limitations

1. **No Email Notifications**: Users must check the app for new invitations
2. **No Time Zone Support**: All times are in user's local timezone
3. **No Meeting Conflicts Detection**: Users can double-book themselves
4. **No Meeting Editing**: Once created, meetings cannot be modified
5. **No Recurring Meetings**: Each meeting is a one-time event

### Future Improvements

If given more time, I would add:

1. **Real-time Notifications**

   - Badge showing count of pending invitations
   - Browser notifications for new invitations
   - Email notifications via Cloud Functions

2. **Calendar Integration**

   - Visual calendar view
   - Conflict detection
   - Google Calendar sync

3. **Enhanced Meeting Features**

   - Edit meeting details
   - Cancel/reschedule meetings
   - Add notes or agenda
   - Meeting reminders
   - Video call integration (Zoom, Google Meet links)

4. **User Experience**

   - Search/filter users by name or bio
   - Pagination for large user lists
   - Profile editing (bio, avatar upload)
   - Dark mode support

5. **Advanced Features**

   - Recurring meetings
   - Group meetings (3+ participants)
   - Meeting templates
   - Time zone conversion
   - Availability calendars

6. **Testing & Quality**

   - Unit tests (Jest + React Testing Library)
   - Integration tests
   - E2E tests (Cypress)
   - Accessibility improvements (ARIA labels, keyboard navigation)

7. **Performance**

   - Infinite scroll for users list
   - Image optimization
   - Query pagination
   - Service worker for offline support

8. **Admin Features**
   - User management
   - Analytics dashboard
   - Activity logs

## 📝 Assumptions Made

1. **Meeting Duration**: All meetings are assumed to be 1 hour long
2. **Time Zones**: Application uses browser's local time zone
3. **User Availability**: No validation of user availability before sending invites
4. **Single Invitation**: Users can send multiple invitations to the same person
5. **Meeting Privacy**: All meeting details are private to participants only
6. **Authentication**: Email/password is sufficient (no OAuth providers)
7. **Data Persistence**: Emulator data persists between runs for convenience

## 🌐 Environment Variables

This application uses Firebase Emulators with hardcoded configuration. For production deployment, you would need:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```
