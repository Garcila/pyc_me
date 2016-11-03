var express       = require('express');
var router        = express.Router();
var Park          = require('../models/park');
var Comment          = require('../models/comment');

//NEW
router.get('/parks/:id/comments/new', isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function (err, park) {
      if(err){
        console.log(err);
      } else {
        res.render('./comments/new', {park: park});
      }
    })
});

//CREATE
router.post('/parks/:id/comments', isLoggedIn, function (req, res) {
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

//MIDDLEWARE ================================================================
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
