const express = require('express');
const mongoose = require('mongoose');
const session = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
require('./config/google');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

app.use(session({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// AUTH ROUTES
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect(`${process.env.FRONTEND_ORIGIN}/dashboard`)
);

app.get('/api/logout', (req, res) => {
  req.logout(() => res.send({ message: 'Logged out' }));
});

app.get('/api/user', (req, res) => {
  if (!req.user) return res.status(401).send({ error: 'Not authenticated' });
  res.send(req.user);
});

// DoseMap routes
const doseMapRoutes = require('./routes/doseMapRoutes');
app.use('/api/dosemaps', doseMapRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
