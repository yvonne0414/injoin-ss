const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置

router.get('/couponList', async (req, res, next) => {
  // 當前頁面
  let page = req.query.page || 1;

  let [data, fields] = await pool.execute('SELECT * FROM `coupon_list`');

  // 總數
  const total = data.length;

  // 計算總頁數
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let [pageData] = await pool.execute('SELECT * FROM `coupon_list` LIMIT ? OFFSET ?', [perPage, offset]);
  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });

  // res.json(data);
});

router.get('/couponDetail/:couponId', async (req, res, next) => {
  let [detailData, fields] = await pool.execute('SELECT * FROM `coupon_list`');

  res.json(detailData);
});

module.exports = router;
