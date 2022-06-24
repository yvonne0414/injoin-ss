const express = require('express');
const router = express.Router();



router.post('/register', (req, res, next) => {
  res.json({code:0, member:"member"});
});


router.post('/login', (req, res, next) => {
  res.json({code:0, member:"member"});
});

router.use('/', (req, res, next) => {
  res.send('auth');
});

module.exports = router;
