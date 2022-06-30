const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// for image upload
const multer = require('multer');
const path = require('path');

//訂單詳細
router.use('/detail/:orderId', async (req, res, next) => {
  // http://localhost:3001/api/order/detail/e66ddd1e-a0f4-bc33-1ca0-f8c3134cf65c

  // console.log(req.body);
  console.log(req.params);
  // console.log(req.query);
  let [orderUser] = await pool.execute(
    `SELECT user_list.id, user_list.name, user_list.phone, user_list.email, user_list.address_country, user_list.address_detail, tw_county.name as countyName FROM user_list JOIN order_list ON user_list.id = order_list.user_id JOIN tw_county ON user_list.address_country = tw_county.code WHERE order_list.id = ?`,
    [req.params.orderId]
  );
  // console.log(orderUser);

  let [orderDetailData, fields] = await pool.execute(
    `SELECT order_list.*, logistics_state_cate.name AS logisticsStatename, logistics_cate.name AS logisticsCateName FROM order_list JOIN logistics_state_cate ON order_list.logistics_state = logistics_state_cate.id JOIN logistics_cate ON order_list.logistics = logistics_cate.id WHERE order_list.id = ?`,
    [req.params.orderId]
  );
  console.log(orderDetailData);

  let [orderPrd] = await pool.execute(
    `SELECT prd_list.id,prd_list.prd_num,prd_list.name,prd_list.price,order_detail.amount,prd_list.category,prd_list.status,prd_list.main_img,prd_list.inventory_quantity FROM order_detail JOIN prd_list ON order_detail.prd_id = prd_list.id WHERE order_id = ?`,
    [req.params.orderId]
  );
  console.log(orderPrd);

  // res.json({
  //   data: orderDetailData,
  // });
  res.json({ orderuser: orderUser, data: orderDetailData, orderprd: orderPrd });
  // {orderuser:orderUser, orederDetail:orderDetailData, orderprd:orderPrd}
});

// 訂單列表 + 分頁
router.get('/', async (req, res, next) => {
  // 當前頁面
  console.log(req.query);
  let page = req.query.page || 1;
  let userId = req.query.userId || 1;
  let logisticsState = req.query.logisticsState || 1;

  // 抓資料
  let [allData, fields] = await pool.execute(
    `SELECT order_list.*, user_list.name as userName, user_list.phone as userPhone, user_list.email as userEmail, user_list.address_detail as userAddress, logistics_state_cate.name as logiStaCateName, logistics_cate.name as logiCateName FROM order_list JOIN user_list ON order_list.user_id = user_list.id JOIN logistics_cate ON order_list.logistics = logistics_cate.id JOIN logistics_state_cate ON order_list.logistics_state = logistics_state_cate.id WHERE order_list.user_id = ? AND order_list.logistics_state = ? `,
    [userId, logisticsState]
  );
  // 總數
  const total = allData.length;
  console.log(total);

  // 計算總頁數
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;

  // 取得這一頁的資料 select * from table limit ? offet ?
  let [pageData] = await pool.execute(
    'SELECT order_list.*, user_list.name as userName, user_list.phone as userPhone, user_list.email as userEmail, user_list.address_detail as userAddress, logistics_state_cate.name as logiStaCateName, logistics_cate.name as logiCateName FROM order_list JOIN user_list ON order_list.user_id = user_list.id JOIN logistics_cate ON order_list.logistics = logistics_cate.id JOIN logistics_state_cate ON order_list.logistics_state = logistics_state_cate.id WHERE order_list.user_id = ? AND order_list.logistics_state = ? ORDER BY order_list.order_time DESC LIMIT ? OFFSET ?',
    [userId, logisticsState, perPage, offset]
  );

  // console.log(pageData);

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageData,
  });
});

//訂單列表
// router.get('/', async (req, res, next) => {
//   let [data, fields] = await pool.execute(
//     'SELECT order_list.*, user_list.name as userName, logistics_state_cate.name as logiStaCateName, logistics_cate.name as logiCateName FROM order_list JOIN user_list ON order_list.user_id = user_list.id JOIN logistics_cate ON order_list.logistics = logistics_cate.id JOIN logistics_state_cate ON order_list.logistics_state = logistics_state_cate.id;'
//   );
//   res.json(data);
// });

module.exports = router;
