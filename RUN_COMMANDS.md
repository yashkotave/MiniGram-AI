# MiniGram-AI - Quick Start Commands

## 🚀 Quick Start (One-Time Setup)

### Step 1: Install Dependencies
```bash
# Install Backend dependencies
cd Backend
npm install
cd ..

# Install Frontend dependencies
cd Frontend
npm install
cd ..
```

### Step 2: Ensure Environment Files Exist
- Backend/.env ✅ (Already created)
- Frontend/.env ✅ (Already created)

### Step 3: Make sure MongoDB is running
MongoDB should be running on `mongodb://localhost:27017`

---

## ✨ App Features

### For Everyone (No Login Required)
- 👁️ **View All Posts** - Browse posts from all users on the Home page
- 🔍 **Explore Posts** - Search posts by hashtags
- 📱 **View Public Posts** - See any user's public posts

### For Authenticated Users
- ✍️ **Create Posts** - Share photos with AI caption generation
- 💬 **Comment & Like** - Interact with posts
- 👤 **View Profile** - See your posts and stats
- 🤖 **AI Features** - Generate captions and hashtags

---

## 🏃 Running the Application

### Option 1: Using Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
- Server runs on: http://localhost:3000
- Database: MongoDB at mongodb://localhost:27017/MiniGramAI

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
- App accessible at: http://localhost:5173

### Option 2: Using Nodemon for Auto-Reload

**Terminal 1 - Backend (with auto-reload):**
```bash
cd Backend
npm run dev  # Uses nodemon
```

**Terminal 2 - Frontend (with HMR):**
```bash
cd Frontend
npm run dev  # Uses Vite with HMR
```

---

## 📝 Default Test Credentials

After creating an account, you can use:
- **Email**: test@example.com
- **Password**: Test@123456
- **Username**: testuser

---

## 🔗 Access Points

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5177 | Running ✅ |
| Backend API | http://localhost:3000 | Running ✅ |
| MongoDB | mongodb://localhost:27017 | Connected ✅ |

**Note**: Frontend port may change (5173, 5174, 5175, 5176, 5177...) if ports are in use. Check your terminal output for the actual port.

---

## 🛠️ Production Build

### Build Frontend for Production
```bash
cd Frontend
npm run build
```
Creates optimized build in `Frontend/dist`

### Start Backend in Production Mode
```bash
cd Backend
NODE_ENV=production npm start
```

---

## 🧪 Testing API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123456",
    "passwordConfirm": "Test@123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

---

## 📦 Key Features to Test

1. **Authentication**
   - Sign up with new account
   - Login with credentials
   - Logout and verify session cleared

2. **Posts**
   - Create a post with caption and image URL
   - Like and unlike posts
   - Comment on posts
   - Delete own posts

3. **AI Features**
   - Generate AI captions
   - Get multiple caption suggestions
   - Generate hashtag suggestions

4. **Social**
   - Follow/unfollow users
   - View user profiles
   - See personalized feed

5. **Explore**
   - Search posts by hashtags
   - Browse all posts
   - Pagination

---

## 🔐 Security Features

✅ Passwords hashed with bcryptjs (10 rounds)
✅ JWT authentication with 30-day expiry
✅ HTTP-only cookies for token storage
✅ CORS properly configured
✅ Input validation on all endpoints
✅ Authorization checks on protected routes

---

## 📊 Performance Notes

- Pagination: 10 posts per feed page, 12 posts for explore
- Database indexes on: username, email, createdAt, post tags
- Virtual fields for computed counts (likes, comments, followers)
- Mongoose population for related data

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Change `PORT` in Backend/.env |
| Port 5173 in use | Vite will auto-increment to 5174 |
| MongoDB not found | Install MongoDB or start `mongod` |
| Module not found | Run `npm install` in the affected directory |
| CORS errors | Check FRONTEND_URL in Backend/.env |
| Blank page on frontend | Check browser console for errors |

---

## 📚 File Structure

```
MiniGram-AI/
├── Backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Database schemas
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Auth & error handling
│   │   ├── service/          # AI service
│   │   └── db/               # Database connection
│   ├── .env                  # Environment variables
│   ├── server.js             # Entry point
│   └── app.js                # Express app setup
│
└── Frontend/
    ├── src/
    │   ├── pages/            # Route pages
    │   ├── components/       # React components
    │   ├── context/          # Auth context
    │   ├── services/         # API calls
    │   ├── App.jsx           # Main app
    │   └── main.jsx          # Entry point
    ├── .env                  # Environment variables
    ├── vite.config.js        # Vite configuration
    └── index.html            # HTML template
```

---

## 🎉 You're All Set!

Your MiniGram-AI application is fully connected and running!

**Next Steps:**
1. Open http://localhost:5173 in your browser
2. Create an account
3. Explore all features
4. Share with friends!

---

For detailed documentation, see:
- README.md - Full project documentation
- QUICKSTART.md - 5-minute setup guide
- CONNECTION_GUIDE.md - Detailed connection guide
- IMPLEMENTATION_SUMMARY.md - Feature checklist
