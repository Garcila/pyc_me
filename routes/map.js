var express       = require('express');
var router        = express.Router();

router.get('/map', function (req, res) {
  res.render('map');
});

module.exports = router;
