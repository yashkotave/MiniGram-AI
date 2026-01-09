# MiniGram-AI

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js), featuring AI-powered capabilities for enhanced user experience.

## Project Overview

MiniGram-AI is a modern social platform that combines traditional social networking features with artificial intelligence integration using Google's Generative AI. Users can create accounts, share posts, and leverage AI features to enhance their content.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB with Mongoose ODM (v9.1.1)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Security**: bcryptjs for password hashing
- **File Handling**: Multer for file uploads
- **AI Integration**: Google Generative AI (@google/genai v1.34.0)
- **Utilities**: Cookie Parser, dotenv for environment variables

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
