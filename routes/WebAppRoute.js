var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var User          = require('../models/users');

/* WELCOME URL */

router.get('/auth/google',
    // passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    passport.use(new GoogleStrategy({
        consumerKey: GOOGLE_CONSUMER_KEY,         //Here You need to put your GOOGLE_CONSUMER_KEY 
        consumerSecret: GOOGLE_CONSUMER_SECRET,   // Here you need to put your GOOGLE_CONSUMER_SECRET
        callbackURL: "http://www.example.com/auth/google/callback"
      },
      function(token, tokenSecret, profile, done) {
          User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
          });
      }
    ));
    res.redirect('/');
});


router.get('/', function (req, res) {
  res.render('index');
})

/* GET WebApp page. */

router.get('/LockSign', function (req, res) {
  res.render('webApp/index');
})

/* GET sign in page. */
router.get('/webApp/sign-in', function (req, res) {
  res.render('webApp/login');
})

/* GET sign up page. */
router.get('/webApp/sign-up', function (req, res) {
  res.render('webApp/signUp');
})


/* POST sign in api. */
router.post('/webApp/signIn', function (req, res) {
  console.log(req.body)
})

module.exports = router;
