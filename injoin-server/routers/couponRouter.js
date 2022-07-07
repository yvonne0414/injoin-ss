const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');
const { default: axios } = require('axios');
// 圖片上傳需要地方放，在 public 裡，建立了 uploads 檔案夾
// 設定圖片儲存的位置

router.get('/couponList/', async (req, res, next) => {
  // 取得當前時間
  const date = new Date();
  console.log(date.toLocaleDateString());

  // 當前頁面
  let page = req.query.page || 1;

  let [data, fields] = await pool.execute(
    'SELECT coupon_list.*, user_coupon.user_id FROM `coupon_list` JOIN user_coupon ON coupon_list.id = user_coupon.coupon_id  WHERE user_id = ? AND end_time > ?',
    [req.query.userId, date]
  );

  // 總數
  const total = data.length;

  // 計算總頁數
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let [pageData] = await pool.execute(
    'SELECT coupon_list.*, user_coupon.user_id FROM `coupon_list` JOIN user_coupon ON coupon_list.id = user_coupon.coupon_id  WHERE user_id = ? AND end_time > ? LIMIT ? OFFSET ? ',
    [req.query.userId, date, perPage, offset]
  );

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
  let [detailData] = await pool.execute('SELECT * FROM `coupon_list` WHERE id = ?', [req.params.couponId]);

  res.json({ detailData: [detailData[0]] });
});

module.exports = router;
