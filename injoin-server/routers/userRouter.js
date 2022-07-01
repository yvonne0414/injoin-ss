const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// 刪除最愛商品
// /api/userlike/del/使用者id/商品id
router.get('/del/:user_id/:prd_id', async (req, res, next) => {
  let [data] = await pool.execute('DELETE FROM user_like WHERE user_id =? AND prd_id=?', [req.params.user_id, req.params.prd_id]);
  // console.log(data);
  res.json({ code: 0, message: '刪除成功' });
});

// 加入最愛商品
// /api/userlike/add/使用者id/商品id
router.get('/add/:user_id/:prd_id', async (req, res, next) => {
  let [data] = await pool.execute(
    `INSERT INTO user_like(user_id, prd_id) VALUES (?,?)
  `,
    [req.params.user_id, req.params.prd_id]
  );
  // console.log(data);
  res.json({ code: 0, message: '加入成功' });
});

// 調酒最愛
// /api/userlike/bartd
router.get('/bartd/:user_id', async (req, res, next) => {
  let page = req.query.page || 1;
  // console.log(req.params.user_id);

  let [data] = await pool.execute(
    'SELECT user_bartd_like.*,user_list.name as user_name, bartd_list.name as bartd_name ,bartd_list.img as bartd_img FROM `user_bartd_like` JOIN user_list ON user_bartd_like.user_id = user_list.id JOIN bartd_list ON user_bartd_like.bartd_id = bartd_list.id WHERE user_bartd_like.user_id = ? ORDER BY user_bartd_like.id DESC',
    [req.params.user_id]
  );

  const total = data.length;
  // 計算總頁數
  const perPage = 8; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;
  [data3] = await pool.execute(
    'SELECT user_bartd_like.*,user_list.name as user_name, bartd_list.name as name ,bartd_list.img as bartd_img FROM `user_bartd_like` JOIN user_list ON user_bartd_like.user_id = user_list.id JOIN bartd_list ON user_bartd_like.bartd_id = bartd_list.id WHERE user_bartd_like.user_id = ? ORDER BY user_bartd_like.id DESC LIMIT ? OFFSET ?',
    [req.params.user_id, perPage, offset]
  );

  // console.log(data);

  for (let index = 0; index < data3.length; index++) {
    let bartd_id = data3[index].id;
    [data2] = await pool.execute('SELECT * FROM `bartd_material` WHERE bartd_material.bartd_id=?', [bartd_id]);
    // console.log(data);
    let string = '';
    for (let j = 0; j < data2.length; j++) {
      string = `${string} ${data2[j].name}`;
    }
    // console.log(data[index]);
    data3[index] = { ...data3[index], material: string };

    console.log(data3[index]);
    console.log(data3);
  }
  
  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: data3,
  });
});

// 我的最愛
// /api/userlike/1
router.get('/:userid', async (req, res, next) => {
  let page = req.query.page || 1;

  let [data] = await pool.execute(
    'SELECT user_like.*,prd_list.* FROM `user_like` JOIN prd_list ON user_like.prd_id = prd_list.id WHERE user_like.user_id = ? ORDER BY user_like.id DESC',
    [req.params.userid]
  );
  // console.log(data);
  const total = data.length;
  // 計算總頁數
  const perPage = 8; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);

  // 計算要跳過幾筆）
  let offset = (page - 1) * perPage;
  [data] = await pool.execute(
    'SELECT user_like.*,prd_list.* FROM `user_like` JOIN prd_list ON user_like.prd_id = prd_list.id WHERE user_like.user_id = ? ORDER BY user_like.id DESC LIMIT ? OFFSET ?',
    [req.params.userid, perPage, offset]
  );

  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },

    data: data,
  });
});

//  /api/userlike
router.get('/', async (req, res, next) => {
  let [data] = await pool.execute('SELECT user_like.*,prd_list.* FROM `user_like` JOIN prd_list ON user_like.prd_id = prd_list.id WHERE user_like.user_id = 1');
  // console.log(data);
  res.json(data);
});

module.exports = router;
