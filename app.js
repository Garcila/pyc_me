var express                 = require('express'),
    bodyParser              = require('body-parser'),
    mongoose                = require('mongoose'),
    app                     = express(),
    seedDB                  = require('./seeds'),
    passport                = require('passport'),
    localStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    User                    = require('./models/user'),
    Park                    = require('./models/park'),
    Comment                 = require('./models/comment');

mongoose.connect('mongodb://localhost/pyc_me');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// seedDB();

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

//ROOT
app.get('/', function (req, res) {
  res.render('landing');
});

//INDEX
app.get('/parks', function (req, res) {
  Park.find({}, function (err, allParks) {
    if(err){
      console.log(err);
    } else {
      res.render('parks/index', {parks: allParks});
    }
  });
});

//CREATE
app.post('/parks', isLoggedIn, function (req, res) {
  // var name = req.body.name;
  // var address = req.body.address;
  // var postalCode = req.body.postalCode;
  // var image = req.body.image;
  // var description = req.body.description;
  // var newPark = {name: name, address: address, postalCode: postalCode, image: image, description: description}
  Park.create(req.body.park, function (err, park) {
    if(err){
      console.log(err);
      res.redirect("/parks/new"); //=========================flash message that postal code must have 6 characters
    } else {
      res.redirect("/parks");
    }
  });
});

//NEW
app.get('/parks/new', isLoggedIn, function (req, res) {
  res.render('parks/new');
});

//SHOW
app.get('/parks/:id', function (req, res) {
  Park.findById(req.params.id).populate('comments').exec(function (err, park) {
    if(err){
      console.log(err);
    } else {
      res.render('parks/show', {park: park});
    }
  });
});

//==============================COMMENTS=======================
//NEW
app.get('/parks/:id/comments/new', function (req, res) {
    Park.findById(req.params.id, function (err, park) {
      if(err){
        console.log(err);
      } else {
        res.render('./comments/new', {park: park});
      }
    })
});

//CREATE
app.post('/parks/:id/comments', function (req, res) {
  //lookup park with ID
  Park.findById(req.params.id, function (err, park) {
    if(err){
      console.log(err);
      res.redirect('/parks');
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if(err){
          console.log(err);
        } else {
          park.comments.push(comment);
          park.save();
          res.redirect('/parks/' + park._id);
        }
      });
    }
  });
});

//==============================USER=======================
//SIGN UP ROUTES ---- REGISTER
app.get('/register', function (req, res) {
  res.render('register');
});

//register logic
app.post('/register', function (req, res) {
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
app.get('/login', function (req, res) {
  res.render('login');
});

//login logic
app.post("/login", passport.authenticate('local',
    {
        successRedirect: '/parks',
        failureRedirect: '/login'
    }), function(req, res){
});

//Logout logic
app.get('/logout', function (req, res) {
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

var PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, function () {
  console.log('Park Your Child server started');
});
