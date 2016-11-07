var express       = require('express');
var router        = express.Router();
var Park          = require('../models/park');
var Comment       = require('../models/comment');
var middleware    = require('../middleware');  //no need to specify index.js.  By default index.js is run when folder is required


//NEW
router.get('/parks/:id/comments/new', middleware.isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function (err, park) {
      if(err){
        console.log(err);
      } else {
        res.render('./comments/new', {park: park});
      }
    });
});

//CREATE
router.post('/parks/:id/comments', middleware.isLoggedIn, function (req, res) {
  //lookup park with ID
  Park.findById(req.params.id, function (err, park) {
    if(err){
      console.log(err);
      res.redirect('/parks');
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if(err){
          req.flash('error', 'Something went wrong');
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          park.comments.push(comment);
          park.save();
          req.flash('success', 'Comment added successfully');
          res.redirect('/parks/' + park._id);
        }
      });
    }
  });
});

//EDIT
router.get('/parks/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, comment) {
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {park_id: req.params.id, comment: comment});
    }
  });
});

//UPDATE
router.put('/parks/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/parks/' + req.params.id);
    }
  });
});

//DESTROY
router.delete('/parks/:id/comments/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if(err){
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/parks/' + req.params.id);
    }
  });
});

module.exports = router;
