var express       = require('express');
var router        = express.Router();
var Park          = require('../models/park');
var Comment       = require('../models/comment');

//NEW
router.get('/parks/:id/comments/new', isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function (err, park) {
      if(err){
        console.log(err);
      } else {
        res.render('./comments/new', {park: park});
      }
    });
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
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          park.comments.push(comment);
          park.save();
          res.redirect('/parks/' + park._id);
        }
      });
    }
  });
});

//EDIT
router.get('/parks/:id/comments/:comment_id/edit', checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, comment) {
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {park_id: req.params.id, comment: comment});
    }
  });
});

//UPDATE
router.put('/parks/:id/comments/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/parks/' + park._id);
    }
  });
});

//DESTROY
router.delete('/parks/:id/comments/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if(err){
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect('/parks/' + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function (err, comment) {
      if(err){
        res.redirect('back');
      } else {
        //does user own comment
        if(comment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;
