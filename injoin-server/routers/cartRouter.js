const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');

/* GET products listing. */
router.get('/', async (req, res, next) => {
  console.log('hi~',req.body);
  console.log(req.params);
  console.log(req.query);
});

module.exports = router;
