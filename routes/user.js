const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send("helloworld - node - router");
});


module.exports = router;