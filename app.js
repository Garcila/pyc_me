var express                 = require('express'),
    bodyParser              = require('body-parser'),
    mongoose                = require('mongoose'),
    app                     = express(),
    seedDB                  = require('./seeds'),
    passport                = require('passport'),
    localStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    methodOverride          = require('method-override'),
    User                    = require('./models/user'),
    Park                    = require('./models/park'),
    Comment                 = require('./models/comment');

var commentRoutes           = require('./routes/comments'),
    parkRoutes              = require('./routes/parks'),
    indexRoutes             = require('./routes/index');

mongoose.connect('mongodb://localhost/pyc_me');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
// seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Please go park your child',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware adds {currentUser: req.user} to all routes, that way I don't have to do it manually
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(parkRoutes);

var PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, function () {
  console.log('Park Your Child server started');
});
