const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
//require('dotenv').config();
require('dotenv').config({ path: '../.env' });

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Redirect root URL to /login
// app.get('/', (req, res) => {
//    res.redirect('/login');
//  });
  

  app.get('/', (req, res) => {
  res.render('yesonit');
});

// Routes
app.use('/', authRoutes);

const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

const toolAccessRoutes = require('./routes/toolAccessRoutes');
app.use('/', toolAccessRoutes);

const toolRoutes = require('./routes/toolRoutes');
app.use('/', toolRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

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