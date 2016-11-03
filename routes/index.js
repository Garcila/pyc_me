var express       = require('express');
var router        = express.Router();
var passport      = require('passport');
var User          = require('../models/user');

//ROOT
router.get('/', function (req, res) {
  res.render('landing');
});

//==============================USER=======================
//SIGN UP ROUTES ---- REGISTER
router.get('/register', function (req, res) {
  res.render('register');
});

//register logic
router.post('/register', function (req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/parks');
    });
  });
});

//LOGIN ROUTES
router.get('/login', function (req, res) {
  res.render('login');
});

//login logic
router.post("/login", passport.authenticate('local',
    {
        successRedirect: '/parks',
        failureRedirect: '/login'
    }), function(req, res){
});

//LOGOUT ROUTE
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/parks');
});


//MIDDLEWARE ================================================================
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
