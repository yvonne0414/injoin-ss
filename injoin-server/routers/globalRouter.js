const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// 縣市
router.get('/cityoptions', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM `tw_county`');
  // console.log(data);
  res.json(data);
});

// 產地
router.get('/origin', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM `prd_origin`');
  // console.log(data);
  res.json({ data });
});

// 會員等級
router.get('/viplevel', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM `vip_level` WHERE id > 0');
  // console.log(data);
  res.json({ data });
});
module.exports = router;
