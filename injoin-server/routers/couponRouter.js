const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

router.get('/couponList/', async (req, res, next) => {
  // 取得當前時間
  const date = new Date().toLocaleDateString();
  console.log(date);

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

// 種類
router.get('/cate', async (req, res) => {
  let [cate] = await pool.execute('SELECT * FROM `coupon_cate`');
  res.json({ data: cate });
});

// 後台列表
router.get('/be/list', async (req, res) => {
  let [data] = await pool.execute(`SELECT * FROM coupon_list`);

  let page = req.query.page || 1;
  const total = data.length;
  // 計算總頁數
  const perPage = 8; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  let [PageData] = await pool.execute('SELECT * FROM coupon_list ORDER BY id DESC LIMIT ? OFFSET ?', [perPage, offset]);

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: PageData,
  });
});

// 新增優惠券
router.post(`/`, async (req, res) => {
  let cate = req.body.cate;
  let name = req.body.name;
  let discount = req.body.discount;
  let ruleMin = req.body.ruleMin;
  let ruleMax = req.body.ruleMax;
  let vipLevel = req.body.vipLevel;
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;

  let [result] = await pool.execute(`INSERT INTO coupon_list (coupon_cate, name, discount, rule_min, rule_max, vip_level, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
    cate,
    name,
    discount,
    ruleMin,
    ruleMax,
    vipLevel,
    startTime,
    endTime,
  ]);

  res.json({ code: 0, result: 'ok' });
});

module.exports = router;
