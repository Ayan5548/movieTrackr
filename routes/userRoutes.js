const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/users");
const flash = require("connect-flash");

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email} = req.body;

    const user = new User({ username, email});

    const registeredUser = await User.register(user, password);

    passport.authenticate('local')(req, res, () => {
      res.redirect('/movies');
    });

  } catch (err) {
    console.log(err);
    res.redirect('/register');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Invalid username or password ');
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      req.flash('success', `Welcome back, ${user.username} 🎬`);

      return res.redirect('/movies');
    });

  })(req, res, next);

});

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) return next(err);
    
    req.flash('success', 'successfully logged out !!');
    res.redirect('/login');
  });
});
module.exports = router;