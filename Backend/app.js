const express = require('express');
const authRoutes = require('./src/routes/auth.routes');
const cookieParser = require('cookie-parser');
const postRoutes = require('./src/routes/post.routes');
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;