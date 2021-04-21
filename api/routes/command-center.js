var express = require('express');
var router = express.Router();
var controller = require('../controller');

router.get('/get-temp', (req, res, next) => {
  res.send(controller.getTemp());
});

module.exports = router;