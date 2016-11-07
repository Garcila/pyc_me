var express         = require('express');
var router          = express.Router();
var Park            = require('../models/park');
var middleware      = require('../middleware');  //no need to specify index.js.  By default index.js is run when folder is required

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
router.post('/parks', middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var address = req.body.address;
  var postalCode = req.body.postalCode;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newPark = {name: name, address: address, postalCode: postalCode, image: image, description: description, author: author};
  Park.create(newPark, function (err, park) {
    if(err){
      console.log(err);
      res.redirect("/parks/new"); //=========================flash message that postal code must have 6 characters
    } else {
      res.redirect("/parks");
    }
  });
});

//NEW
router.get('/parks/new', middleware.isLoggedIn, function (req, res) {
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

//EDIT
router.get('/parks/:id/edit', middleware.checkParkOwnership, function (req, res) {
  Park.findById(req.params.id, function (err, park) {
    res.render('parks/edit', {park: park});
  });
});

//UPDATE
router.put('/parks/:id', middleware.checkParkOwnership, function (req, res) {
  Park.findByIdAndUpdate(req.params.id, req.body.park, function (err, park) {
    if(err){
      console.log(err);
      res.redirect('/parks');
    } else {
      res.redirect('/parks/' + req.params.id);
    }
  });
});

//DESTROY
router.delete('/parks/:id', middleware.checkParkOwnership, function (req, res) {
  Park.findByIdAndRemove(req.params.id, function (err) {
    if(err){
      res.redirect('/parks');
    } else {
      req.flash('success', 'Park deleted');
      res.redirect('/parks');
    }
  });
});

module.exports = router;
