# MiniGram-AI Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your API Keys

1. **Google Generative AI (Gemini)**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy your API key

2. **MongoDB Atlas**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

### Step 2: Backend Configuration

```bash
cd Backend

# Create .env file
cat > .env << EOF
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_32_character_secret_key_here_minimum_32
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF

# Install and run
npm install
npm run dev
```

### Step 3: Frontend Configuration

```bash
cd Frontend

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
EOF

# Install and run
npm install
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

## 📝 Default Test Credentials

After registration, you can test the application with:

```
Email: test@example.com
Password: password123
Username: testuser
```

## 🎯 Key Features to Try

1. **Register & Login**
   - Create new account
   - JWT token stored in HTTP-only cookies

2. **Create Post with AI Caption**
   - Upload image
   - Describe image content
   - Click "Generate AI Captions"
   - Select or customize caption
   - Add tags
   - Publish

3. **Social Features**
   - Like/Unlike posts
   - Add comments
   - Follow/Unfollow users
   - View personalized feed

4. **Search & Explore**
   - Search posts by tags
   - Browse all posts
   - View user profiles

## 🔧 Environment Variables

### Backend Required
```
MONGO_URI      - MongoDB connection string
JWT_SECRET     - 32+ character secret key
GEMINI_API_KEY - Google Generative AI key
```

### Frontend Optional
```
VITE_API_URL   - Backend API URL (default: http://localhost:3000/api)
```

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:**
- Check MONGO_URI in .env
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure internet connection is stable

### Issue: "CORS error"
**Solution:**
- Check FRONTEND_URL in backend .env
- Verify frontend is running on correct port
- Clear browser cache and cookies

### Issue: "AI caption generation fails"
**Solution:**
- Verify GEMINI_API_KEY is valid
- Check API quota in Google Cloud Console
- Ensure image description is provided

### Issue: "Authentication not working"
**Solution:**
- Clear all cookies in browser
- Check JWT_SECRET is properly set
- Verify token is being sent in request headers

## 📱 API Testing with Postman

1. **Import Collection**
   - Use the endpoints listed in README.md

2. **Test Authentication Flow**
   ```
   1. POST /auth/register - Create account
   2. POST /auth/login - Get JWT token
   3. GET /auth/me - Verify authentication
   ```

3. **Test Post Operations**
   ```
   1. POST /posts - Create post
   2. GET /posts - Get all posts
   3. POST /posts/:id/like - Like a post
   ```

4. **Test AI Features**
   ```
   POST /ai/generate-suggestions
   {
     "imageDescription": "A beautiful sunset over the ocean"
   }
   ```

## 🎨 Customization

### Change Colors
Edit in `Frontend/src/index.css` or `Frontend/src/App.css`:
```css
/* Change primary color from pink to your preference */
:root {
  --primary-color: #ec4899; /* Pink - change this */
}
```

### Change App Name
- Update "MiniGram" in Frontend/src/components/Navbar.jsx
- Update site title in Frontend/index.html

### Modify Database Schema
- Edit models in `Backend/src/models/`
- Update controllers accordingly
- Re-run migrations if applicable

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Generative AI](https://ai.google.dev/)

## 🚢 Deployment Checklist

### Before Production
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET (min 32 chars)
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Enable database backups
- [ ] Set up error logging
- [ ] Configure rate limiting
- [ ] Test all API endpoints
- [ ] Verify environment variables
- [ ] Create .gitignore entries

### Deployment Steps
1. Push code to GitHub
2. Deploy backend to Heroku/Render/Railway
3. Deploy frontend to Vercel/Netlify
4. Update FRONTEND_URL in backend .env
5. Update VITE_API_URL in frontend .env
6. Test all features on production

## 💡 Pro Tips

1. **Image Uploads**: Use base64 encoding or image URLs for storage
2. **AI Captions**: Provide detailed image descriptions for better captions
3. **Performance**: Enable database indexing on frequently queried fields
4. **Security**: Never commit .env files to version control
5. **Testing**: Use Postman or curl to test API before frontend

## 📧 Support & Troubleshooting

If you encounter issues:
1. Check the error message carefully
2. Review the troubleshooting section above
3. Check console logs (Ctrl+Shift+I)
4. Review backend logs in terminal
5. Verify all environment variables are set

## 🎉 You're All Set!

Start creating amazing content with AI-powered captions! Happy coding! 🚀
