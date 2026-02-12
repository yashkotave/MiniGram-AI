# MiniGram-AI - AI-Powered Social Media Platform

A modern, full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js) featuring AI-powered caption generation using Google Gemini.

## 🌟 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **User Profiles**: Complete profile management with follow/unfollow functionality
- **Post Management**: Create, read, update, and delete posts with images
- **Social Features**: Like posts, add comments, follow users
- **AI Caption Generation**: Generate creative captions using Google Gemini AI
- **Tag System**: Organize posts with hashtags and search by tags
- **Responsive Design**: Beautiful, fully responsive UI using Tailwind CSS

### AI Features
- **Auto Caption Generation**: Generate captions based on image descriptions
- **Multiple Suggestions**: Get multiple caption options to choose from
- **Hashtag Generation**: AI-powered hashtag suggestions for better reach
- **Caption Editing**: Edit AI-generated captions before posting

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Generative AI** - AI caption generation
- **CORS** - Cross-origin requests

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Routing
- **Context API** - State management

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB Atlas account
- Google Generative AI API key

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MiniGram-AI
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# GEMINI_API_KEY=your_gemini_api_key
# FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed
# VITE_API_URL=http://localhost:3000/api
```

## 🔧 Configuration

### Backend .env
```
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/minigram-ai

# JWT
JWT_SECRET=your_secret_key_here_min_32_chars

# AI Service
GEMINI_API_KEY=your_google_gemini_api_key

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend .env
```
VITE_API_URL=http://localhost:3000/api
```

## 📦 Running the Application

### Development Mode

#### Terminal 1 - Backend
```bash
cd Backend
npm run dev
# Server runs on http://localhost:3000
```

#### Terminal 2 - Frontend
```bash
cd Frontend
npm run dev
# App runs on http://localhost:5173
```

### Production Build

#### Backend
```bash
cd Backend
npm start
```

#### Frontend
```bash
cd Frontend
npm run build
npm run preview
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/follow/:userId` - Follow user
- `DELETE /api/auth/unfollow/:userId` - Unfollow user
- `GET /api/auth/user/:username` - Get user by username

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts
- `GET /api/posts/feed` - Get user's feed
- `GET /api/posts/:postId` - Get specific post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like post
- `DELETE /api/posts/:postId/like` - Unlike post
- `POST /api/posts/:postId/comments` - Add comment
- `DELETE /api/posts/:postId/comments/:commentId` - Delete comment
- `GET /api/posts/search/tag` - Search by tag

### AI Features
- `POST /api/ai/generate-caption` - Generate single caption
- `POST /api/ai/generate-suggestions` - Generate multiple captions
- `POST /api/ai/generate-hashtags` - Generate hashtags

## 📁 Project Structure

```
MiniGram-AI/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── post.controller.js
│   │   │   └── ai.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── post.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── post.routes.js
│   │   │   └── ai.routes.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   └── db/
│   │       └── db.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── PostCard.jsx
│   │   ├── pages/
│   │   │   ├── Authentication.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── axios.js
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
│
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Protection against XSS attacks
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Configuration**: Restricted cross-origin requests
- **Input Validation**: Server-side validation on all endpoints
- **Protected Routes**: Frontend route protection
- **Email Validation**: Proper email format validation

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimalist interface
- **Responsive Layout**: Mobile-first design approach
- **Dark Mode**: Dark mode support with Tailwind CSS
- **Loading States**: Visual feedback for async operations
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error notifications
- **Smooth Animations**: CSS transitions and hover effects

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend CORS is configured correctly
- Check that frontend URL matches FRONTEND_URL in backend .env
- Verify cookies are being sent with `withCredentials: true`

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network access is enabled

### AI API Errors
- Verify GEMINI_API_KEY is valid
- Check API quota limits
- Ensure image descriptions are provided

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET length (min 32 chars)
- Verify token expiration time

## 📝 Best Practices

- Always use HTTPS in production
- Keep API keys secure in environment variables
- Implement rate limiting for API endpoints
- Add comprehensive error logging
- Use database indexing for frequently queried fields
- Implement pagination for large datasets
- Add input sanitization
- Use CSRF tokens if needed

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Generative AI for AI capabilities
- MongoDB for database solutions
- Tailwind CSS for styling framework
- React community for amazing tools and libraries

---

**Made with ❤️ by MiniGram-AI Team**

### Frontend
- **Library**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Module System**: ES Modules

## Project Structure

```
MiniGram-AI/
├── Backend/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── package.json
│   └── src/
│       ├── controllers/       # Request handlers
│       │   ├── auth.controller.js
│       │   └── post.controller.js
│       ├── db/               # Database configuration
│       │   └── db.js
│       ├── middlewares/      # Custom middleware
│       │   └── auth.middleware.js
│       ├── models/           # Database schemas
│       │   ├── post.model.js
│       │   └── user.model.js
│       ├── routes/           # API routes
│       │   ├── auth.routes.js
│       │   └── post.routes.js
│       └── service/          # Business logic
│           └── ai.service.js
└── Frontend/
    ├── src/
    │   ├── App.jsx          # Main App component
    │   ├── App.css
    │   ├── index.css
    │   ├── main.jsx         # Entry point
    │   └── assets/
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    └── index.html
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)
- Google Generative AI API key

### Backend Setup

1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_API_KEY=your_google_generative_ai_key
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register` - Create a new user account
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Posts Routes (`/api/posts`)
- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Fetch a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## Key Features

- **User Authentication**: Secure JWT-based authentication with bcryptjs password hashing
- **Post Management**: Create, read, update, and delete posts
- **AI Integration**: Google Generative AI service for intelligent features
- **File Upload**: Image and file upload support using Multer
- **Responsive UI**: Modern, responsive design with Tailwind CSS
- **Cookie Management**: Secure cookie-based session handling

## Development

### Available Scripts

**Backend**:
- `npm start` - Start the server

**Frontend**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

### Backend `.env`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minigram
JWT_SECRET=your_secret_key_here
GOOGLE_API_KEY=your_google_api_key
PORT=5000
NODE_ENV=development
```

## Future Enhancements

- User profiles and following system
- Comments and likes functionality
- Real-time notifications
- Advanced AI features (image generation, content recommendations)
- User search and discovery
- Direct messaging

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, please create an issue in the repository or contact the project maintainer.

---

**Note**: Make sure to never commit your `.env` file with sensitive credentials. Use `.env.example` to document required environment variables.
