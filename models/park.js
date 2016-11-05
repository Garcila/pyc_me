var mongoose = require('mongoose');

var parkSchema = new mongoose.Schema({
  name:         {type: String, required: true},
  address:      {type: String, required: true},
  postalCode:   {type: String, minlength: ['6', 'Postal Code must be at least 6 characters'] },
  description:  String,
  image:        String,
  author:       {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
      },
      username: String
  },
  comments:     [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Comment"
    }
  ]
});

module.exports = mongoose.model("Park", parkSchema);
