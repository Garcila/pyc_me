var mongoose = require('mongoose'),
    data     = require('./data'),
    Comment  = require('./models/comment'),
    Park     = require('./models/park');

function seedDB() {
  //remove all parks
  Park.remove({}, function (err) {
    if(err){
      console.log(err);
    }
    console.log('removed parks');
    data.forEach(function (seed) {
      Park.create(seed, function (err, park) {
        if(err){
          console.log(err);
        } else {
          console.log('added park')
          //create a comment
          Comment.create(
            {
              text: "asdfasdfasdfdfasdfasdfasdfasdfasdfa",
              author: "Pprrp"
            }, function (err, comment) {
              if(err){
                console.log(err);
              } else {
                park.comments.push(comment);
                park.save();
                console.log('Created new comment');
              }
            });
        }
      });
    });
  });
}

module.exports = seedDB;
