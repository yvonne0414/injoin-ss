const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

router.get('/', async (req, res, next) => {
  console.log('我是test');
  let [data, fields] = await pool.execute('SELECT * FROM `bartd_list`');
  res.json(data);
});

module.exports = router;
