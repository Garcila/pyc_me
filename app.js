var express                 = require('express'),
    bodyParser              = require('body-parser'),
    mongoose                = require('mongoose'),
    app                     = express();

mongoose.connect('mongodb://localhost/pyc_me');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//SCHEMA SETUP
var parkSchema = new mongoose.Schema({
  name:         {type: String, required: true},
  address:      {type: String, required: true},
  postalCode:   {type: String, minlength: ['6', 'Postal Code must be at least 6 characters'] },
  description:  String,
  image:        String
});

var Park = mongoose.model("Park", parkSchema);

// Park.create(
//     {
//       name: '2',
//       address: '2 Palace',
//       postalCode: '234567',
//       description: 'Lucio fulci tremor est dark vivos magna. Expansis creepy arm yof darkness ulnis witchcraft missing carnem armis Kirkman Moore and Adlard caeruleum in locis. Romero morbo Congress amarus in auras.',
//       image: 'https://static.pexels.com/photos/179768/pexels-photo-179768-medium.jpeg'
//     }, function (err, park) {
//     if(err){
//       console.log(err)
//     } else {
//       console.log("created a park");
//       console.log(park);
//     }
//   }
// );

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
      res.render('index', {parks: allParks});
    }
  });
});

//CREATE
app.post('/parks', function (req, res) {
  var name = req.body.name;
  var address = req.body.address;
  var postalCode = req.body.postalCode;
  var image = req.body.image;
  var description = req.body.description;
  var newPark = {name: name, address: address, postalCode: postalCode, image: image, description: description}
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
app.get('/parks/new', function (req, res) {
  res.render('new');
});

//SHOW
app.get('/parks/:id', function (req, res) {
  Park.findById(req.params.id, function (err, park) {
    if(err){
      console.log(err);
    } else {
      res.render('show', {park: park});
    }
  })
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, function () {
  console.log('Park Your Child server started');
});
