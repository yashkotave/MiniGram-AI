# MiniGram-AI - Connection & Deployment Guide

## ✅ Status: CONNECTED & RUNNING

Both the frontend and backend are now fully connected and running successfully!

---

## 🚀 What's Running

### Backend Server
- **Port**: 3000
- **URL**: http://localhost:3000
- **Status**: ✅ Running with nodemon (auto-reload enabled)
- **Database**: Connected to MongoDB at `mongodb://localhost:27017/MiniGramAI`
- **API Health**: All endpoints are operational

### Frontend Development Server
- **Port**: 5173
- **URL**: http://localhost:5173
- **Status**: ✅ Running with Vite dev server
- **Framework**: React 19.2.0 with Vite 7.3.0

### Connection Status
- ✅ Frontend configured to communicate with backend at `http://localhost:3000/api`
- ✅ CORS enabled for cross-origin requests
- ✅ Credentials (cookies) enabled for authentication

---

## 📋 Issues Fixed

### 1. Backend Issues Resolved
- ✅ Fixed email-validator import (replaced with regex validation)
- ✅ Fixed incorrect import path for ai.service (`../services/` → `../service/`)
- ✅ Removed duplicate code from ai.service.js
- ✅ Removed malformed code from post.controller.js
- ✅ Added missing environment variables (PORT, FRONTEND_URL, NODE_ENV)

### 2. Frontend Issues Resolved
- ✅ Removed duplicate code from AuthContext.jsx
- ✅ Cleaned up Explore.jsx (removed duplicate JSX code)
- ✅ Fixed Home.jsx (removed extra button code after component)
- ✅ Fixed Profile.jsx structure

### 3. Configuration Issues Resolved
- ✅ Created `.env` file for Frontend with correct API URL
- ✅ Updated Backend `.env` with all necessary variables
- ✅ Installed all dependencies for both frontend and backend

---

## 🧪 Testing the Application

### 1. Access the Application
- Open your browser and navigate to: **http://localhost:5173**

### 2. Create an Account
1. Click on "Sign Up" tab
2. Enter:
   - **Username**: Any unique username
   - **Email**: Any valid email (e.g., test@example.com)
   - **Password**: At least 6 characters
   - **Confirm Password**: Same as password
3. Click "Sign Up"

### 3. Test Features
Once logged in, you can:
- **Create Posts**: Click the "Create Post" button, add image URL, caption, and tags
- **AI Captions**: Generate AI-powered captions for your posts
- **Social Features**: Like, comment, and share posts
- **Follow Users**: Search and follow other users
- **Explore**: Browse all posts or search by hashtags
- **Profile**: View and edit your profile

---

## 🔧 Running the Application

### Terminal 1 - Backend
```bash
cd "Backend"
npm run dev
```
This starts the backend server on port 3000 with nodemon (auto-restart on file changes)

### Terminal 2 - Frontend
```bash
cd "Frontend"
npm run dev
```
This starts the Vite dev server on port 5173 with HMR (Hot Module Replacement)

---

## 📁 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/MiniGramAI
JWT_SECRET=f59362f00609d7157a80113654043fe3
GEMINI_API_KEY=AIzaSyCrp6i_UrQSTImZJHuqg9DDrjwA4N_SoRY
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution**: Make sure backend is running on port 3000
- Check: http://localhost:3000/api/health

### Issue: "MongoDB connection failed"
**Solution**: Ensure MongoDB is running
- Windows: Start MongoDB service
- Linux/Mac: `mongod` in another terminal

### Issue: "Port already in use"
**Solution**: Change the port in environment variables or kill the process using that port

### Issue: "Module not found" errors
**Solution**: 
```bash
# Backend
cd Backend && npm install

# Frontend
cd Frontend && npm install
```

### Issue: "CORS errors"
**Solution**: The CORS is already configured correctly for localhost:5173 to connect to localhost:3000/api

---

## 🎯 Next Steps

1. **Test API endpoints** using Postman or cURL
2. **Explore the application** by creating posts and interacting with other users
3. **Test AI features** by generating captions for posts
4. **Deploy to production** when ready (see README.md for deployment guide)

---

## 📊 Technology Stack Running

### Backend
- Node.js with Express.js 5.2.1
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Google Generative AI (Gemini 2.0-flash) for caption generation

### Frontend
- React 19.2.0
- Vite 7.3.0 (build tool)
- React Router DOM 7.12.0 (routing)
- Tailwind CSS 4.1.18 (styling)
- Axios 1.6.2 (HTTP client)
- Lucide React 0.562.0 (icons)

---

## 📞 Support

If you encounter any issues:
1. Check the error messages in the terminal
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check that ports 3000 and 5173 are not in use
5. Run `npm install` in both directories if missing dependencies

---

**Your MiniGram-AI application is ready to use! 🎉**

Open http://localhost:5173 in your browser and start exploring!
