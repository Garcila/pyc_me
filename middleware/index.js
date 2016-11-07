var Comment       = require('../models/comment');
var Park            = require('../models/park');

var middlewareObj = {};

middlewareObj.checkParkOwnership = function (req, res, next) {
  if(req.isAuthenticated()){
    Park.findById(req.params.id, function (err, park) {
      if(err){
        req.flash('error', 'Park not found');
        res.redirect('back');
      } else {
        //does user own park
        if(park.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You can not edit that park.  It belongs to someone else');
          res.redirect('/parks/' + req.params.id);
        }
      }
    });
  } else {
    req.flash('error', 'Please log in first');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function (err, comment) {
      if(err){
        res.redirect('back');
      } else {
        //does user own comment
        if(comment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You can not edit that comment.  It belongs to someone else');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please log in first');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'Please Login First');
  res.redirect('/login');
};

module.exports = middlewareObj;
