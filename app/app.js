const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // ✅ Added
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env' });

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ MongoDB-backed session store
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 2 // 2 hours
  }
}));

// Pass user info to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Root route
app.get('/', (req, res) => {
  res.render('yesonit');
});

// Routes
app.use('/', authRoutes);
app.use('/', require('./routes/homeRoutes'));
app.use('/', require('./routes/toolAccessRoutes'));
app.use('/', require('./routes/toolRoutes'));
app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/departmentRoutes'));
app.use('/', require('./routes/requestRoutes'));
app.use('/', require('./routes/testLoginRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});