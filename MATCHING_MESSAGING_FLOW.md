# Matching & Messaging Flow Documentation

## Overview

This document outlines the complete user flow from discovery to messaging in the Simples Connect dating app. The system is designed to work seamlessly from swiping to conversation.

## 🔄 Complete User Flow

### 1. **Discovery Phase** (`/discover`)
- **Component**: `RealMatchingComponent`
- **Purpose**: Users swipe through potential matches
- **Actions**: Like, Pass, View Profile
- **Backend**: `/api/matching/potential-matches`, `/api/matching/interact`

### 2. **Matching Phase**
- **Trigger**: When two users like each other
- **Component**: `MatchNotification` (popup)
- **Backend**: Creates entry in `matches` table
- **User Experience**: "It's a Match!" notification with option to message

### 3. **Matches Management** (`/matches`)
- **Component**: `MatchesView`
- **Purpose**: View all matches in a grid layout
- **Features**: Match details, message button, unmatch option
- **Backend**: `/api/matching/matches`

### 4. **Messaging Phase** (`/messages`)
- **Component**: `Messages`
- **Purpose**: Chat with matches
- **Features**: Real-time messaging, image sharing, read receipts
- **Backend**: `/api/messages/*`

## 🔧 Technical Implementation

### Components Integration

#### 1. **RealMatchingComponent** (Discover)
```javascript
// When user likes someone
const handleLikeClick = async () => {
  const result = await handleLike(currentProfile.id);
  if (result.isMatch && result.matchData) {
    setMatchData(result.matchData); // Show match notification
  }
};

// Navigate to messages from match notification
const handleSendMessage = (match) => {
  navigate('/messages', { 
    state: { 
      selectedMatch: {
        id: match.id,
        matchId: match.id,
        name: match.other_user?.full_name,
        photo: match.other_user?.profile_picture_url,
        userId: match.other_user?.id
      }
    } 
  });
};
```

#### 2. **MatchesView** (Matches Management)
```javascript
// Navigate to messages with match pre-selected
const handleStartConversation = (match) => {
  navigate('/messages', { 
    state: { 
      selectedMatch: {
        id: match.id,
        matchId: match.id,
        name: match.other_user.full_name,
        photo: match.other_user.profile_picture_url,
        userId: match.other_user.id
      }
    }
  });
};
```

#### 3. **Messages** (Messaging)
```javascript
// Handle pre-selected match from navigation
useEffect(() => {
  if (location.state?.selectedMatch) {
    const preSelectedMatch = location.state.selectedMatch;
    setSelected(preSelectedMatch);
    if (preSelectedMatch.matchId) {
      loadMessages(preSelectedMatch.matchId);
    }
  }
}, [location.state, conversations]);
```

### Backend API Endpoints

#### Matching APIs
- `GET /api/matching/potential-matches` - Get users to swipe on
- `POST /api/matching/interact` - Record like/pass, create matches
- `GET /api/matching/matches` - Get user's matches
- `POST /api/matching/unmatch` - Deactivate a match

#### Messaging APIs
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/match/:matchId` - Get messages in a match
- `POST /api/messages/send` - Send a message
- `POST /api/messages/read/:matchId` - Mark messages as read

### Database Schema

#### Key Tables
```sql
-- User interactions (likes/passes)
user_interactions (
  id, user_id, target_user_id, interaction_type, created_at
)

-- Matches (mutual likes)
matches (
  id, user1_id, user2_id, created_at, is_active
)

-- Messages
messages (
  id, match_id, sender_id, receiver_id, content, 
  message_type, created_at, is_read
)
```

## 🎯 User Experience Flow

### Step-by-Step Journey

1. **User opens Discover** (`/discover`)
   - Sees potential matches one by one
   - Can swipe left (pass) or right (like)
   - Can view full profile before deciding

2. **User likes someone**
   - Backend records interaction
   - If mutual like → creates match + shows notification
   - If no mutual like → just records like

3. **Match notification appears**
   - "It's a Match!" popup
   - Option to "Send Message" or "Keep Swiping"
   - Clicking "Send Message" → navigates to Messages

4. **User views all matches** (`/matches`)
   - Grid layout of all matches
   - Each match shows photo, name, match date
   - "Message" button for each match
   - Option to unmatch if needed

5. **User starts conversation**
   - Clicking "Message" → navigates to Messages
   - Pre-selects the conversation
   - Loads message history if any exists

6. **User chats** (`/messages`)
   - Real-time messaging
   - Image sharing with captions
   - Read receipts
   - Persistent conversation history

## 🔄 Navigation Flow

```
Dashboard
├── Discover (/discover)
│   ├── Like → Match Notification → Messages
│   └── Pass → Next Profile
├── Matches (/matches)
│   ├── View Match Details (Modal)
│   ├── Message → Messages (pre-selected)
│   └── Unmatch → Confirmation
└── Messages (/messages)
    ├── Conversation List
    ├── Chat Interface
    └── Image Sharing
```

## 🛠️ Testing the Flow

### Automated Testing
Use the `FlowTest` component at `/test-flow` to verify:
- Authentication works
- Can fetch potential matches
- Can record like interactions
- Can fetch user matches
- Can load conversations
- Can send messages

### Manual Testing Steps
1. **Register/Login** as two different users
2. **Complete profiles** for both users
3. **User A**: Go to Discover, like User B
4. **User B**: Go to Discover, like User A
5. **Verify**: Match notification appears
6. **Click**: "Send Message" from notification
7. **Verify**: Redirected to Messages with conversation pre-selected
8. **Send**: Test message
9. **User B**: Check Messages, verify message received
10. **Go to**: Matches page, verify match appears
11. **Click**: "Message" from matches page
12. **Verify**: Conversation loads with message history

## 🔧 Configuration

### Environment Variables
```env
# Frontend (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### API Base URL
The system uses relative URLs (`/api/*`) to work with any port configuration.

## 🚨 Common Issues & Solutions

### 1. **Match not showing in Messages**
- **Cause**: Navigation state not properly set
- **Solution**: Ensure `selectedMatch` object has all required fields

### 2. **API calls failing**
- **Cause**: Authentication token missing
- **Solution**: Check Supabase session and token handling

### 3. **Messages not persisting**
- **Cause**: Database connection or permissions
- **Solution**: Verify RLS policies and foreign key constraints

### 4. **Real-time not working**
- **Cause**: Supabase realtime not enabled
- **Solution**: Enable realtime on `matches` and `messages` tables

## 📊 Performance Considerations

### Frontend
- **Lazy loading**: Components load only when needed
- **State management**: Minimal re-renders with proper useEffect dependencies
- **Image optimization**: Compressed images with fallbacks

### Backend
- **Database indexes**: On user_id, target_user_id, match_id
- **Query optimization**: Proper joins and filtering
- **Rate limiting**: Prevent spam interactions

### Real-time
- **Selective subscriptions**: Only subscribe to relevant changes
- **Connection management**: Proper cleanup on unmount
- **Debouncing**: Prevent excessive real-time updates

## 🔐 Security

### Authentication
- **JWT tokens**: Secure session management
- **Row-level security**: Database-level permissions
- **API validation**: Input sanitization and validation

### Privacy
- **Match visibility**: Only matched users can message
- **Profile privacy**: Respect user privacy settings
- **Data protection**: Secure file uploads and storage

## 🎯 Success Metrics

### User Engagement
- **Swipe rate**: Users actively swiping
- **Match rate**: Successful mutual likes
- **Message rate**: Matches leading to conversations
- **Retention**: Users returning to continue conversations

### Technical Performance
- **API response time**: < 500ms for all endpoints
- **Real-time latency**: < 100ms for message delivery
- **Error rate**: < 1% for critical operations
- **Uptime**: 99.9% availability

This flow ensures a seamless user experience from discovery to meaningful conversations! 🎉 