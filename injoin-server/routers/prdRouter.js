const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

router.get('/', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM `prd_list`');
  res.json(data);
});

module.exports = router;
