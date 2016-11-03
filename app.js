var express                 = require('express'),
    bodyParser              = require('body-parser'),
    mongoose                = require('mongoose'),
    app                     = express(),
    seedDB                  = require('./seeds'),
    Park                    = require('./models/park'),
    Comment                 = require('./models/comment');

mongoose.connect('mongodb://localhost/pyc_me');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// seedDB();

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
app.post('/parks', function (req, res) {
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
app.get('/parks/new', function (req, res) {
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

var PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, function () {
  console.log('Park Your Child server started');
});
