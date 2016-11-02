var mongoose = require('mongoose'),
    data     = require('./data'),
    Comment  = require('./models/comment'),
    Park     = require('./models/park'),
    Faker    = require('Faker');

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
          console.log('added park');
          //add Faker data to description and image
            Park.update(
              // {$set: { description: Faker.Lorem.sentence() }},
              // {$set: { image: Faker.Image.city() }},
              {},{description: 'Here goes description of the park',
              image: 'https://cdn.pbrd.co/images/agXHvkBUX.png'},
              {upsert: false,
               multi: true}
            ,function (err) {
              if(err){
                console.log(err)
              }
            });
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
