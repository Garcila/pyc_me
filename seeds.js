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
          console.log('added park');
          //add Faker data to description and image
            Park.update(
              // {$set: { description: Faker.Lorem.sentence() }},
              // {$set: { image: Faker.Image.city() }},
              {},{description: "Lucio fulci tremor est dark vivos magna. Expansis creepy Lucio fulci tremor est dark vivos magna. Expansis creepy arm yof darkness ulnis witchcraft missing carnem armis Kirkman Moore and Adlard caeruleum in locis. Romero morbo Congress amarus in auras. Nihil horum sagittis tincidunt, zombie slack-jawed gelida survival portenta. The unleashed virus est, et iam zombie mortui ambulabunt super terram. Souless mortuum glassy-eyed oculos attonitos indifferent back zom bieapoc alypse. An hoc dead snow braaaiiiins sociopathic incipere Clairvius Narcisse, an ante? Is bello mundi z?",
              image: 'https://cdn.pbrd.co/images/myVacWUL9.jpg'},
              {upsert: false,
               multi: true}
              ,function (err) {
                if(err){
                  console.log(err)
                }
              }
            );
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
