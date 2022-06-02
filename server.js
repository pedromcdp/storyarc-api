// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authCheck = require('./middlewares/authCheck');
const api = require('./controllers/apiController');
const errorHandling = require('./controllers/errorHandling');

// Definitions
const app = express();
const PORT = process.env.PORT || 8080;

// Routes Imports
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');
const commentsRoute = require('./routes/comments');

mongoose.connect(process.env.DB_CONNECT, () => {
  console.log('connected to DB');
});

// Middlewares
app.use(cors());
app.use(express.json());

// Default endpoint
app.get('/', api.welcome);

// Routes Middleware
app.use('/posts', postsRoute);
app.use('/users', authCheck, usersRoute);
app.use('/comments', commentsRoute);

// Middleware if there's no matched endpoint
app.use(errorHandling.error400);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
