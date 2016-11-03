var express         = require('express');
var router          = express.Router();
var Park            = require('../models/park');

//INDEX
router.get('/parks', function (req, res) {
  Park.find({}, function (err, allParks) {
    if(err){
      console.log(err);
    } else {
      res.render('parks/index', {parks: allParks});
    }
  });
});

//CREATE
router.post('/parks', isLoggedIn, function (req, res) {
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
router.get('/parks/new', isLoggedIn, function (req, res) {
  res.render('parks/new');
});

//SHOW
router.get('/parks/:id', function (req, res) {
  Park.findById(req.params.id).populate('comments').exec(function (err, park) {
    if(err){
      console.log(err);
    } else {
      res.render('parks/show', {park: park});
    }
  });
});

//MIDDLEWARE ================================================================
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
