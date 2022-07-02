const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置

router.get('/coupon', async (req, res, next) => {
  let [data, fields] = await pool.execute('SELECT * FROM `coupon_list` WHERE 1');

  res.json(data);
});

module.exports = router;
