# Simples Connect 💙

A modern dating app designed specifically for Ugandans around the world to find meaningful connections.

## 🌟 Features

### ✅ Implemented
- **User Authentication**: Email signup and Google OAuth
- **Profile Management**: Complete profile setup with photos, bio, and interests
- **Smart Matching**: AI-powered compatibility scoring based on interests and preferences
- **Real-time Messaging**: Chat with your matches instantly
- **Responsive Design**: Beautiful UI that works on all devices
- **Protected Routes**: Secure navigation based on authentication status

### 🚧 Coming Soon
- **Community Lounge**: Share stories and get advice from the diaspora
- **Local Events**: Find Ugandan events in your city
- **Advanced Settings**: Detailed privacy and notification controls

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simples-connect
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/simples-connect
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Start the development servers**
   ```bash
   npm start
   ```

   This will start both:
   - Backend API: http://localhost:5000
   - Frontend App: http://localhost:5173

## 🏗️ Project Structure

```
simples-connect/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   └── App.jsx          # Main app component
│   └── package.json
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # Express routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Express server
└── package.json            # Root package.json
```

## 🔧 Available Scripts

### Root Level
- `npm start` - Start both frontend and backend
- `npm run dev` - Same as start (development mode)
- `npm run frontend` - Start only frontend
- `npm run backend` - Start only backend
- `npm run install-all` - Install dependencies for all projects
- `npm run build` - Build frontend for production

### Frontend (cd frontend)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (cd backend)
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-restart)

## 🎨 Design System

### Colors
- **Primary Ocean**: #2563eb (Blue)
- **Secondary Sky**: #0ea5e9 (Light Blue)
- **Accent Tropical**: #06b6d4 (Cyan)
- **Neutral Cloud**: #f8fafc (Light Gray)
- **Text Midnight**: #1e293b (Dark Blue)

### Components
- Responsive design with Tailwind CSS
- Custom gradient buttons and cards
- Smooth animations and transitions
- Mobile-first approach

## 🔐 Authentication Flow

1. **Landing Page**: User sees signup form
2. **Registration**: Email or Google signup
3. **Profile Completion**: Add bio, interests, photos
4. **Dashboard**: Access to all features
5. **Protected Routes**: Automatic redirects based on auth status

## 💬 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Matching
- `GET /api/matching/potential-matches` - Get potential matches
- `POST /api/matching/like` - Like a user
- `POST /api/matching/pass` - Pass on a user

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:id` - Get conversation messages
- `POST /api/messages/send` - Send a message
- `PUT /api/messages/read/:id` - Mark message as read

### Users
- `PUT /api/users/profile` - Update user profile

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String,
  password: String,
  profile: {
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    bio: String,
    interests: [String],
    photos: [Object]
  },
  preferences: {
    interestedIn: String,
    ageRange: { min: Number, max: Number }
  },
  interactions: {
    likes: [ObjectId],
    passes: [ObjectId],
    matches: [ObjectId]
  }
}
```

### Message Model
```javascript
{
  conversationId: String,
  senderId: String,
  recipientId: String,
  content: String,
  imageUrl: String,
  status: String,
  timestamp: Date
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API URL

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy from `backend` folder
3. Ensure MongoDB connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Backend not connecting to MongoDB**
   - Check MongoDB is running
   - Verify MONGODB_URI in .env file

2. **Google OAuth not working**
   - Check Google Client ID and Secret
   - Verify callback URL in Google Console

3. **Frontend can't reach backend**
   - Ensure backend is running on port 5000
   - Check CORS settings

4. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📞 Support

For support, email support@simplesconnect.com or create an issue in this repository.

---

Made with 💙 for the Ugandan diaspora worldwide. 