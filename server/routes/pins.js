var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

router.get('/', (req, res, next) => {
  req.collection.find({})
    .toArray()
    .then(results => res.json(results))
    .catch(error => res.send(error));
});

router.post('/', (req, res, next) => {
  const { id, value } = req.body;
  if (!id || !value) {
    return res.status(400).json({
      message: "id and value are required",
    });
  }

  const payload = { id, value };
  req.collection.insertOne(payload)
    .then(result => res.json(result))
    .catch(error => res.send(error));
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(`delete called with ${id}`);
  const _id = ObjectID(id);

  req.collection.deleteOne({ _id })
    .then(result => res.json(result))
    .catch(error => res.send(error));

});


module.exports = router;
